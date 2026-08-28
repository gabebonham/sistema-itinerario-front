export interface PaginatedResponse<T> {
    data:T
    page:number
    pageSize:number
    total:number
    hasNext:boolean
    hasPrevious:boolean
}