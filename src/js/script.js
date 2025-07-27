import { default as render } from "./render/render"
import { default as getPosts } from "./api/get"
import { default as addPost } from "./api/post"
import { default as updatePost } from "./api/edit"
import { default as deletePost } from "./api/delete"
import { default as updateLikes } from "./api/updateLikes"
import { default as renderComments } from "./render/renderComments"
import { default as postComment } from "./api/postComments"

let postsList = []

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
        console.log(data[0].commentList);
        document.querySelector(".posts").innerHTML = render(data);
        postsList = data
        console.log(postsList)
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


let commentPostId = null


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

    if (e.target.closest('.comment-button')) {
            document.querySelector('.modal-backdropCommments').classList.remove('hidden');  
            const commentButton = e.target.closest('.comment-button')
            const postCard = commentButton.closest('.post-card');
            commentPostId = postCard.dataset.id;

            getPosts().then((data) => {
                document.querySelector(".comments").innerHTML = renderComments(data.find(post => post.id === commentPostId).commentList)
            })
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


document.querySelector('#search-form input[name="query"]').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();

  document.querySelectorAll('.post-card').forEach(card => {
    const userName = card.querySelector('.user').textContent.toLowerCase();
    if (userName.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});


// document.querySelector('.comment-button').addEventListener(() => {
    
// })

document.querySelector('.close-comment-button').addEventListener('click', () => {
    document.querySelector('.modal-backdropCommments').classList.add('hidden');
})


// document.querySelector(".comments").addEventListener("click", (e) => {
//   if (e.target.classList.contains("delete-comment")) {
//     const index = e.target.dataset.index;
//     const postId = currentPostId; 
//     deleteComment(postId, index);
//   }
// });





let updatedList = []

document.querySelector('.post-comment-button').addEventListener('click', () => {
    let comment = document.querySelector('#info').value
    
    getPosts().then(
        (data) =>{
            let post = data.find(post => post.id === commentPostId)
            console.log(post.commentList)
            updatedList = updatedList.concat(post.commentList)
            updatedList.push(comment)
            let comments = updatedList.length;

        
            postComment(updatedList, commentPostId, comments).then(() => {
                getPosts().then(
                    (data) =>{
                        document.querySelector(".posts").innerHTML = render(data);
                    }
                );
        });
        }
    );

    
    document.querySelector('.modal-backdropCommments').classList.add('hidden');
    document.querySelector('#info').value = ""
})


document.querySelector('.comments').addEventListener('click', (e) => {
    if (e.target.closest('.delete-comment')) { 
        const commentButton = e.target.closest('.delete-comment');
        const commentCard = commentButton.closest('li.comment-card');
        const commentToDelete = commentCard.querySelector('.comment-info').textContent.trim();
        console.log('Deleting comment:', commentToDelete);

        getPosts().then((data) => {
            let post = data.find(post => post.id === commentPostId);
            console.log('Original comments:', post.commentList);

            
            const originalList = [...post.commentList];
            const indexToRemove = originalList.indexOf(commentToDelete);

            if (indexToRemove !== -1) {
                originalList.splice(indexToRemove, 1);
            }

            const updatedList = originalList;
            let comments = updatedList.length;

           
            console.log('Updated comments:', updatedList);
            postComment(updatedList, commentPostId, comments).then(() => {
                getPosts().then(
                    (data) =>{
                        document.querySelector(".posts").innerHTML = render(data);
                    }
                );
            });

             
            document.querySelector('.modal-backdropCommments').classList.add('hidden');
        });
    }
});






