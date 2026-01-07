'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    Upload,
    CheckCircle2,
    AlertCircle,
    FileText,
    X,
    ArrowLeft,
    ArrowRight,
    Copy,
    Check
} from 'lucide-react';
import { FormField, DocumentRequirement } from '@/lib/psb-config';
import { submitPSBRegistration, PSBFormData, DocumentUpload } from '@/actions/psb-actions';

interface PSBFormProps {
    unitId: string;
    unitName: string;
    unitSlug: string;
    fields: FormField[];
    documents: DocumentRequirement[];
}

interface UploadedFile {
    documentType: string;
    file: File;
    preview?: string;
}

export default function PSBForm({
    unitId,
    unitName,
    unitSlug,
    fields,
    documents
}: PSBFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Documents, 3: Confirmation
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; registrationNumber?: string } | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Handle form field change
    const handleFieldChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validate step 1 (form data)
    const validateFormData = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach(field => {
            if (field.required && !formData[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} wajib diisi`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate step 2 (documents)
    const validateDocuments = (): boolean => {
        const newErrors: Record<string, string> = {};

        documents.forEach(doc => {
            if (doc.required) {
                const uploaded = uploadedFiles.find(f => f.documentType === doc.type);
                if (!uploaded) {
                    newErrors[doc.type] = `${doc.label} wajib diupload`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle file upload
    const handleFileUpload = (documentType: string, file: File, maxSizeMB: number) => {
        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [documentType]: `Ukuran file maksimal ${maxSizeMB}MB`
            }));
            return;
        }

        // Clear error
        if (errors[documentType]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[documentType];
                return newErrors;
            });
        }

        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
        }

        // Update uploaded files
        setUploadedFiles(prev => {
            const filtered = prev.filter(f => f.documentType !== documentType);
            return [...filtered, { documentType, file, preview }];
        });
    };

    // Remove uploaded file
    const removeFile = (documentType: string) => {
        setUploadedFiles(prev => prev.filter(f => f.documentType !== documentType));
    };

    // Handle next step
    const handleNext = () => {
        if (step === 1) {
            if (validateFormData()) {
                setStep(2);
            }
        } else if (step === 2) {
            if (validateDocuments()) {
                setStep(3);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            // Prepare form data
            const psbFormData: PSBFormData = {
                unitId,
                unitName,
                unitSlug,
                namaLengkap: formData.namaLengkap || '',
                tempatLahir: formData.tempatLahir || '',
                tanggalLahir: formData.tanggalLahir || '',
                jenisKelamin: formData.jenisKelamin || '',
                alamatLengkap: formData.alamatLengkap || '',
                nisn: formData.nisn,
                asalSekolah: formData.asalSekolah || '',
                namaOrangTua: formData.namaOrangTua || '',
                noHpOrangTua: formData.noHpOrangTua || '',
                emailOrangTua: formData.emailOrangTua,
            };

            // Convert files to base64 (browser-compatible)
            const documentUploads: DocumentUpload[] = await Promise.all(
                uploadedFiles.map(async (uf) => {
                    const arrayBuffer = await uf.file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);

                    // Convert to base64 in browser-compatible way
                    let binary = '';
                    uint8Array.forEach((byte) => {
                        binary += String.fromCharCode(byte);
                    });
                    const base64 = btoa(binary);

                    console.log(`Converted ${uf.file.name}: ${uf.file.size} bytes -> ${base64.length} base64 chars`);

                    return {
                        documentType: uf.documentType,
                        fileName: uf.file.name,
                        fileSize: uf.file.size,
                        mimeType: uf.file.type,
                        base64Data: base64,
                    };
                })
            );

            // Submit
            const result = await submitPSBRegistration(psbFormData, documentUploads);
            setSubmitResult(result);

            if (result.success) {
                // Tunggu sebentar agar render selesai, lalu scroll ke elemen sukses
                setTimeout(() => {
                    const successElement = document.getElementById('psb-success-message');
                    if (successElement) {
                        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }

        } catch (error) {
            console.error('Submit error:', error);
            setSubmitResult({
                success: false,
                message: 'Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get uploaded file for a document type
    const getUploadedFile = (documentType: string) => {
        return uploadedFiles.find(f => f.documentType === documentType);
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Copy to clipboard
    const [copied, setCopied] = useState(false);
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Render success result
    if (submitResult?.success) {
        return (
            <div id="psb-success-message" className="max-w-2xl mx-auto text-center py-8 sm:py-12 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-3 sm:mb-4">
                    Pendaftaran Berhasil!
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                    {submitResult.message}
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <p className="text-sm text-emerald-700 mb-2">Nomor Pendaftaran Anda:</p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <p className="text-lg sm:text-2xl font-mono font-bold text-emerald-900 break-all">
                            {submitResult.registrationNumber}
                        </p>
                        <button
                            onClick={() => handleCopy(submitResult.registrationNumber || '')}
                            className={`p-2 rounded-lg transition-all ${copied
                                ? 'bg-emerald-200 text-emerald-700'
                                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 active:scale-95'
                                }`}
                            title="Salin nomor pendaftaran"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                    {copied && (
                        <p className="text-xs text-emerald-600 mt-2 animate-in fade-in">
                            ✓ Tersalin ke clipboard!
                        </p>
                    )}
                    <p className="text-xs text-emerald-600 mt-3">
                        Simpan nomor ini untuk mengecek status pendaftaran
                    </p>
                </div>
                <button
                    onClick={() => router.push('/psb')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Halaman PSB
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8 sm:mb-12">
                {[
                    { num: 1, label: 'Data Diri' },
                    { num: 2, label: 'Upload' },
                    { num: 3, label: 'Konfirmasi' },
                ].map((s, idx) => (
                    <div key={s.num} className="flex items-center">
                        {/* Circle with number */}
                        <div className="flex flex-col items-center">
                            <div className={`
                                flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-sm sm:text-base transition-colors
                                ${step >= s.num
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'}
                            `}>
                                {step > s.num ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : s.num}
                            </div>
                            {/* Label below circle */}
                            <span className={`mt-2 text-xs font-medium text-center ${step >= s.num ? 'text-emerald-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                        {/* Connector line */}
                        {idx < 2 && (
                            <div className={`w-12 sm:w-20 h-0.5 mx-2 sm:mx-3 -mt-6 rounded ${step > s.num ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-4 sm:mb-6">
                        Data Calon Santri
                    </h2>
                    <p className="text-sm text-slate-500 mb-4 sm:mb-6 -mt-2 sm:-mt-4">
                        {unitName}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {fields.map((field) => (
                            <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {field.type === 'select' ? (
                                    <select
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        className={`
                                            w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg bg-white transition-colors text-sm sm:text-base
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                            ${errors[field.name] ? 'border-red-500' : 'border-slate-300'}
                                        `}
                                    >
                                        <option value="">Pilih {field.label}</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                        className={`
                                            w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-colors resize-none text-sm sm:text-base
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                            ${errors[field.name] ? 'border-red-500' : 'border-slate-300'}
                                        `}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`
                                            w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-colors text-sm sm:text-base
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                                            ${errors[field.name] ? 'border-red-500' : 'border-slate-300'}
                                        `}
                                    />
                                )}

                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors[field.name]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6 sm:mt-8">
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Lanjutkan
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Upload Documents */}
            {step === 2 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-2">
                        Upload Berkas
                    </h2>
                    <p className="text-sm text-slate-500 mb-6 sm:mb-8">
                        Format: PDF, JPG, atau PNG
                    </p>

                    <div className="space-y-4 sm:space-y-6">
                        {documents.map((doc) => {
                            const uploadedFile = getUploadedFile(doc.type);

                            return (
                                <div
                                    key={doc.type}
                                    className={`
                                        border-2 border-dashed rounded-xl p-4 sm:p-6 transition-colors
                                        ${uploadedFile
                                            ? 'border-emerald-300 bg-emerald-50'
                                            : errors[doc.type]
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-slate-200 hover:border-emerald-400'}
                                    `}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                                                {doc.label}
                                                {doc.required && <span className="text-red-500 ml-1">*</span>}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{doc.description}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Maks: {doc.maxSizeMB}MB
                                            </p>
                                        </div>

                                        {uploadedFile ? (
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-emerald-200 min-w-0">
                                                    <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm text-slate-700 truncate max-w-[120px] sm:max-w-[150px]">
                                                        {uploadedFile.file.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        ({formatFileSize(uploadedFile.file.size)})
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(doc.type)}
                                                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    ref={(el) => { fileInputRefs.current[doc.type] = el; }}
                                                    type="file"
                                                    accept={doc.acceptedFormats.join(',')}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(doc.type, file, doc.maxSizeMB);
                                                    }}
                                                    className="hidden"
                                                />
                                                <button
                                                    onClick={() => fileInputRefs.current[doc.type]?.click()}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {errors[doc.type] && (
                                        <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors[doc.type]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
                        <button
                            onClick={() => setStep(1)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Lanjutkan
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-4 sm:mb-6">
                        Konfirmasi Pendaftaran
                    </h2>

                    {submitResult && !submitResult.success && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-700">{submitResult.message}</p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm text-emerald-700">1</span>
                                Data Calon Santri
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        <p className="text-xs text-slate-500">{field.label}</p>
                                        <p className="font-medium text-slate-800">
                                            {field.type === 'select'
                                                ? field.options?.find(o => o.value === formData[field.name])?.label || '-'
                                                : formData[field.name] || '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm text-emerald-700">2</span>
                                Berkas yang Diupload
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="space-y-3">
                                    {uploadedFiles.map((uf) => {
                                        const docInfo = documents.find(d => d.type === uf.documentType);
                                        return (
                                            <div key={uf.documentType} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-700">{docInfo?.label}</p>
                                                    <p className="text-xs text-slate-500 truncate">{uf.file.name}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-sm text-emerald-700">3</span>
                                Unit Pendidikan
                            </h3>
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="font-bold text-emerald-900 text-lg">{unitName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            <strong>Perhatian:</strong> Pastikan semua data yang Anda masukkan sudah benar.
                            Setelah submit, data tidak dapat diubah. Tim kami akan memverifikasi berkas Anda
                            dan menghubungi melalui nomor HP yang terdaftar.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 sm:mt-8">
                        <button
                            onClick={() => setStep(2)}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Kirim Pendaftaran
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
