
import axios, { Axios, AxiosResponse } from 'axios';

const makeCall = async (url: string, method: string, headers?:any,data?: any):Promise<AxiosResponse> => {
    let res:Promise<AxiosResponse<any>>   ;
    return new Promise((resolve, reject) => {
        if(method === 'GET'){
            res = axios.get(url, {headers})
        }
        if(method === 'POST'){
            res = axios.post(url, data, {headers})
        }



        res.then((response: any) => {
            resolve(response)
        }).catch((error: any) => {
            reject(error)
        })

    })
   
  
}

export {makeCall}