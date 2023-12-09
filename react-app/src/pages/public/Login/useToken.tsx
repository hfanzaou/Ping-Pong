import React from "react";
import { useState, Dispatch, SetStateAction } from "react";

export default function useToken() {
    
    const getToken = (): string | '' => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString ?? '""');

        // console.log("From LocalStorage", userToken);
        
        return userToken?.token || "";
    };

    const [token, setToken] = useState<string | ''>(() => getToken());

    const saveToken = (userToken: string | '') => {
        localStorage.setItem('token', JSON.stringify({token: userToken}));
        // console.log("From /login/api ", userToken);
        setToken(userToken);
      };

      return {
        setToken: saveToken,
        token
      }
}