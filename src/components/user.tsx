'use client'

import { User } from "@/types/User";
import * as React from "react"

export function useUserObject(userId?: string | number) {
    const [user, setUser] = React.useState<User>();

    React.useEffect(() => {
        async function fetchUser() {
                const response = await fetch(`https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/${userId}`);
                const raw = await response.json();
                setUser(raw?.data ?? raw);
        }
        fetchUser();
    }, [userId]);

    return user;
}
