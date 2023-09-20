export class LocationWithRadius {
    constructor(
        private id: string,
        private latitude: number,
        private longitude: number,
        private radius: number) {
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            latitude: this.latitude,
            longitude: this.longitude,
            radius: this.radius,
        };
    }

    // Static method to create a Reminder from a JSON object
    static fromJSON(data: Record<string, any>): LocationWithRadius {
        return new LocationWithRadius(
            data.id,
            data.latitude,
            data.longitude,
            data.radius,
        );
    }

    overlaps(otherLocationWithRadius: LocationWithRadius): boolean {
        const distanceBetweenLocations = Math.sqrt(Math.pow(this.latitude - otherLocationWithRadius.latitude, 2) + Math.pow(this.longitude - otherLocationWithRadius.longitude, 2));
        return distanceBetweenLocations - (this.radius + otherLocationWithRadius.radius) > 0;
    }
}