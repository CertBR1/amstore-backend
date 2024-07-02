export class CreateWebhookDto {
    id: number;
    action: string;
    type: string;
    data: {
        id: number
    }
}
