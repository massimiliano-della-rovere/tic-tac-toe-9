export class InvalidUserError extends Error {
    constructor(...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidUserError)
        }

        this.name = "InvalidUserError"
    }
}
