import React, { useContext } from 'react'
import Context from './context'

const useData = () => {
    const items=useContext(Context)
  return items
}

export default useData