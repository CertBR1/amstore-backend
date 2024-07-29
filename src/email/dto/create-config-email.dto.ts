export class CreateConfigEmailDto {
    host: string
    port: number
    username: string
    password: string
    from: string
    template: string
    status: boolean
} 