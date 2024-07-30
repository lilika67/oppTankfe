document.addEventListener('DOMContentLoaded', function() {
  // Like Button Functionality
  const likeBtn = document.querySelector('.like-btn');
  const likeCount = document.querySelector('.like-count');
  let likes = 0;

  likeBtn.addEventListener('click', function() {
      likes++;
      likeCount.textContent = likes;
  });

  // Comment Form Functionality
  const commentForm = document.querySelector('.comment-form');
  const commentList = document.querySelector('.comment-list');

  commentForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const commentText = commentForm.querySelector('textarea').value;

      if (commentText) {
          const newComment = document.createElement('div');
          newComment.classList.add('comment');
          newComment.textContent = commentText;
          commentList.appendChild(newComment);

          // Clear the textarea
          commentForm.querySelector('textarea').value = '';
      }
  });
});
