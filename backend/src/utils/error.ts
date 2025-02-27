class CustomError extends Error {
    statusCode: number;
    constructor(message: string, name: string, statusCode: number) {
        super(message);
        this.message = message;
        this.name = name;
        this.statusCode = statusCode;
    }
}

export default CustomError