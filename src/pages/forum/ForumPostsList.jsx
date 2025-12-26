import ForumPostsItem from "./ForumPostsItem";

function ForumPostsList({posts}) {
    console.log(posts)
       return (
        <div className="col-12 mt-5 forum__list d-flex flex-column">
            {posts.map(post => {
                return <ForumPostsItem key={post.id} post={post} />
            })}
        </div>
    )
}

export default ForumPostsList
