import type { Models } from "../database/models"
import type Sequelize, { Model } from "sequelize"

declare module "sequelize" {
  type NonConstructorKeys<T> = { [P in keyof T]: T[P] extends new () => any ? never : P }[keyof T]
  type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>

  export type ModelStatic<M extends Model> = NonConstructor<typeof Model> & { new (): M } & {
    associate?: (reg: Models) => void
  } & { decrement?: any }

  export interface FindAndCountOptions extends Sequelize.FindAndCountOptions {
    page?: number
  }
}

declare global {
  export interface NextQuery {
    params: { [key: string]: string | Array<string> }
  }

  export interface ApiResponseError {
    error: string
  }

  export interface ApiResponseBasic {
    success: boolean
  }

  export interface Pagination {
    limit: number
    total: number
    current_page: number
    total_pages: number
  }

  export interface ListResponse<T = any> {
    pagination: Pagination
    items: Array<T>
  }

  export interface PaginationProps {
    page: number
    limit: number
  }

  export interface ListQueryParams<T = {}> extends T, PaginationProps {}

  export interface LogListFilters {
    from: string
    to: string
    template: string
    host: string
    code: number
  }
}
