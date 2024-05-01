import { PAGE_SIZE } from "./consts"

export const convertPageToOffsetLimit = (page, pageSize = PAGE_SIZE) => {

    let offset = 0
    if (page > 1) {
      offset = (page - 1) * pageSize
    }
    return [{ offset: offset }, { limit: pageSize }]
  
  }