export class TokenRotationService {
    public static isRefreshNeeded(accessValidUntil: string) {
        return Math.floor((new Date(accessValidUntil).getTime() - Date.now()) / 1000) < 30;
    }

    public static isActiveToken(validUntil: string) {
        return Math.floor((new Date(validUntil).getTime() - Date.now()) / 1000) > 0;
    }
}
