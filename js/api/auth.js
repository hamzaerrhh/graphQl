export async function login(data) {
    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${data.login}:${data.password}`),
            },
            body: JSON.stringify(data)
        })
        return [response.status, await response.json()]
    } catch (error) {
        console.error(`Error trying to login${error}`);
    }
}
