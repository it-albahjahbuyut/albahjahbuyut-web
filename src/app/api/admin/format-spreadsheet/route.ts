import { NextRequest, NextResponse } from 'next/server';
import { formatSpreadsheet, formatAllSheets } from '@/lib/spreadsheet-format';

/**
 * API endpoint untuk format spreadsheet
 * GET /api/admin/format-spreadsheet?sheet=SMP
 * GET /api/admin/format-spreadsheet?all=true
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const sheetName = searchParams.get('sheet');
        const all = searchParams.get('all');

        if (all === 'true') {
            const result = await formatAllSheets();
            return NextResponse.json(result);
        }

        if (sheetName) {
            const result = await formatSpreadsheet(sheetName);
            return NextResponse.json(result);
        }

        // Default: format SMP sheet
        const result = await formatSpreadsheet('SMP');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error formatting spreadsheet:', error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
