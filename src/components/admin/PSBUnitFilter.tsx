'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Unit {
    id: string;
    name: string;
}

interface PSBUnitFilterProps {
    units: Unit[];
    currentUnit?: string;
}

export default function PSBUnitFilter({ units, currentUnit }: PSBUnitFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('unit', value);
        } else {
            params.delete('unit');
        }
        router.push(`/admin/psb?${params.toString()}`);
    };

    return (
        <select
            defaultValue={currentUnit || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white"
        >
            <option value="">Semua Unit</option>
            {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                    {unit.name}
                </option>
            ))}
        </select>
    );
}
