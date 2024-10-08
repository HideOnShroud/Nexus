export interface Item {
    Id: string
    name: string
    size: number
    createdAt?: string  // Optional because it may not be present when fetching or updating
}
