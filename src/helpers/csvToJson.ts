export function csvToJson(csv : string) {
    // \n or \r\n depending on the EOL sequence
    const lines = csv.split('\n');
    const delimeter = ',';

    const result = [];

    const headers = lines[0].split(delimeter);

    for (const line of lines.slice(1)) {

        if (line.trim()) {
            const obj : any = {};
            const row = line.split(delimeter);

            for (let i = 0; i < headers.length; i++) {
                const header = headers[i];

                if (Number(row[i])) {
                    obj[header] = +row[i];
                } else {
                    obj[header] = row[i];
                }
            }
            result.push(obj);
        }
    }
    // Prettify output
    return result;
}