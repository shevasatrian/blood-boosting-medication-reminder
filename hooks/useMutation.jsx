/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable padded-blocks */
/* eslint-disable key-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable space-in-parens */
/* eslint-disable function-paren-newline */
/* eslint-disable semi */
/* eslint-disable linebreak-style */
import { useCallback, useState } from "react"

export const useMutation = () => {
  const [data, setData] = useState({
    data: null,
    isLoading: true,
    isError: false,
  })

  const mutate = useCallback(
    async ( {url = "", method = "POST", payload = {}, headers = {} } = {}) => {
      console.log('payload => ', payload)
    // setData({
    //   ...data,
    //   isLoading: true,
    // })
    try {
      const response = await fetch(url, { 
        method, 
        headers: {
          "Content-type": "application/json",
          ...headers
        },
        ...(method !== "GET" && { body: JSON.stringify(payload) }),
       } );
      const result = await response.json();
      setData({
        ...data,
        data: result,
        isLoading: false,
      })
      return { ...result }
    } catch (error) {
      setData({
        ...data,
        isError:true,
        isLoading: false,
      })
      return error
    }
  }, [])

  return { ...data, mutate }
  
}