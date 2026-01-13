'use client'

import * as React from "react"
import { User } from "@/types/User";

export function fetchUserObject(userId?: string | number) {
    const [user, setUser] = React.useState<User>();

    React.useEffect(() => {
        async function fetchUser() {
            const response = await fetch(`https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/user/${userId}`);
            const user = await response.json();
            setUser(user);
        }
        fetchUser();
    }, [userId]);

    return user;
}
