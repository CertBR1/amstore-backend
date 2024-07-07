export class Functions {
    static async sleep(ms: number) { }

    static genetareCode(count: number) {
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            randomNumbers.push(randomNumber);
        }
        return randomNumbers.map((number) => number.toString()).join('');
    }
}