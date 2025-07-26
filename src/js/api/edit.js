export default async function updatePost(postData, id) {
  try {
    return await fetch(`https://6882a21521fa24876a9b6374.mockapi.io/posts/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then((res) => res.json())
  } catch (error) {
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}
}


