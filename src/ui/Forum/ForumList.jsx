import data from '../../../public/data.json'
import ForumItem from './ForumItem'

function ForumList() {
    const posts = data.forum
    return (
        <div className="col-12 mt-5 forum__list d-flex flex-column">
            {posts.map(post => {
                return <ForumItem key={post.id} post={post} />
            })}
        </div>
    )
}

export default ForumList
