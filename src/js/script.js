import { default as render } from "./render"
import { default as getPosts } from "./api/get"
import { default as addPost } from "./api/post"
import { default as updatePost } from "./api/edit"
import { default as deletePost } from "./api/delete"
import { default as updateLikes } from "./api/updateLikes"




document.querySelector('.add').addEventListener('click', () => {
  document.querySelector('.modal-backdrop').classList.remove('hidden');
});

document.querySelector('.close-modal').addEventListener('click', () => {
  document.querySelector('.modal-backdrop').classList.add('hidden');
});

document.querySelector('.close-modalEdit').addEventListener('click', () => {
  document.querySelector('.modal-backdropEdit').classList.add('hidden');
});



getPosts().then(
    (data) =>{
        console.log(data);
        document.querySelector(".posts").innerHTML = render(data);

    }
  );

document.querySelector('#new-post-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const imageUrl = e.target.elements.url.value;
    const userName = e.target.elements.Username.value;

    const postObject = {
        userName: userName,
        imageUrl: imageUrl,
        likes: 0,
        comments: 0
    };
    console.log(postObject)
    addPost(postObject).then(() => {
        getPosts().then((data) => {
            document.querySelector(".posts").innerHTML = render(data);
            document.querySelector('.modal-backdrop').classList.add('hidden');
    })})

    e.target.elements.Username.value = "";
    e.target.elements.url.value = "";
  });


document.querySelector('.posts').addEventListener('click', (e) => {
    if (e.target.closest('.like-button')){
        const likeButton = e.target.closest('.like-button')
        const postCard = likeButton.closest('.post-card');
        const postId = postCard.dataset.id;
        const likesElement = postCard.querySelector('.likes-p');
        let likes = Number(likesElement.textContent);

        if (likeButton.classList.contains('.liked')) return;

        likes += 1;
        likesElement.textContent = likes;
        likeButton.classList.add('.liked'); 
        updateLikes(likes, postId)
    };
});

document.querySelector('.posts').addEventListener('click', (e) => {
    if (e.target.closest('.delete')){
        const postCard = e.target.closest('.post-card');
        const id = postCard.getAttribute('data-id'); 
        deletePost(id).then(() => {
            getPosts().then((data) => {
                console.log(data);
                document.querySelector(".posts").innerHTML = render(data);
            })})
    }}
)




let postId = null
document.querySelector('.posts').addEventListener('click', (e) => {
  if (e.target.closest('.edit')) {
    const postCard = e.target.closest('.edit').closest('.post-card');
    postId = postCard.dataset.id;

    document.querySelector('#username').value = postCard.querySelector('.user').textContent;
    document.querySelector('#url').value = postCard.querySelector('.photo-post').src;

    document.querySelector('.modal-backdropEdit').classList.remove('hidden');
  }
});

console.log(postId)

document.querySelector('.edit-button').addEventListener('click', () => {
  const updatedPost = {
        userName: document.querySelector('#username').value,
        imageUrl: document.querySelector('#url').value,
    };
    console.log(updatedPost)
    console.log(postId)
    updatePost(updatedPost, postId).then(() => getPosts()).then((data) => {
        document.querySelector(".posts").innerHTML = render(data);
        document.querySelector('.modal-backdropEdit').classList.add('hidden');
    })
        .catch(error => {
            console.error('Error updating post:', error);
    });
})



