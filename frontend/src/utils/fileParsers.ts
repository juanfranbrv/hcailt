const readAsText = (file: File, encoding: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = reject;
    reader.readAsText(file, encoding);
  });

export async function parseTxt(file: File) {
  try {
    return await readAsText(file, 'utf-8');
  } catch {
    return readAsText(file, 'latin1');
  }
}

export async function parsePdf(file: File) {
  const pdfjs = await import('pdfjs-dist/build/pdf');
  // @ts-expect-error setting worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str || '').join(' ') + '\n';
  }
  return text.trim();
}

export async function parseDocx(file: File) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}
