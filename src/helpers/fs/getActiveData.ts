import { isEmpty } from 'lodash'
import { Repo } from '../../pages'
import { ActiveData, Data, defaultActiveData } from '../../store/store'

export const getActiveData = (
  activeRepo: Repo | null,
  data: Data
): ActiveData => {
  if (!activeRepo || !data[activeRepo.full_name] || isEmpty(data)) {
    return defaultActiveData
  } else {
    return data[activeRepo.full_name]
  }
}
