import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    forumPosts: [],
    error: "",
    isFetching: false,
}

export const fetchForumPosts = createAsyncThunk("forumPosts/fetchForumPosts", async () => {
    const res = await fetch("http://localhost:5212/api/ForumPosts");
    const data = await res.json();
    console.log(data);
    return data;
})

export const addNewForumPost = createAsyncThunk("forumPosts/addNewForumPost", async (newForumPost, {rejectWithValue}) => {
    const res = await fetch("http://localhost:5212/api/ForumPosts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newForumPost),
    });

    if (!res.ok) {
        return rejectWithValue("Failed to add new forum post");
    }

    const data = await res.json();
    return data;
});

export const editForumPost = createAsyncThunk("forumPosts/editForumPost", async ({id, updatedForumPost}, {rejectWithValue}) => {
    const res = await fetch(`http://localhost:5212/api/ForumPosts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedForumPost),
    });

    if (!res.ok) {
        return rejectWithValue("Failed to edit forum post");
    }

    if(res.status == 204){
        return {id, ...updatedForumPost};
    }

    const data = await res.json();
    return data;
})

export const deleteForumPost = createAsyncThunk("forumPosts/deleteForumPost", async (id, {rejectWithValue}) => {
    const res = await fetch(`http://localhost:5212/api/ForumPosts/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        return rejectWithValue("Failed to delete forum post");
    }

    return id;
});

const forumPostsSlice = createSlice({
    name: "forumPosts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchForumPosts.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchForumPosts.fulfilled, (state, action) => {
                state.isFetching = false;
                state.forumPosts = action.payload;
                state.error = "";
            })
            .addCase(fetchForumPosts.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.error.message;
            })
            .addCase(addNewForumPost.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(addNewForumPost.fulfilled, (state, action) => {
                state.isFetching = false;
                state.forumPosts.push(action.payload);
                state.error = "";
            })
            .addCase(addNewForumPost.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.payload;
            })
            .addCase(editForumPost.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(editForumPost.fulfilled, (state, action) => {
                state.isFetching = false;
                state.error = "";
            })
            .addCase(editForumPost.rejected, (state, action) => {
                state.isFetching = false;
                state.error = action.payload;
            })
            .addCase(deleteForumPost.fulfilled, (state, action) => {
                state.forumPosts = state.forumPosts.filter(post => post.id !== action.payload);
                state.isFetching = false;
                state.error = "";
            })
            .addCase(deleteForumPost.rejected, (state, action) => {
                state.error = action.payload;
                state.isFetching = false;
            })
            .addCase(deleteForumPost.pending, (state) => {
                state.isFetching = true;
        
            });
    }
})

export default forumPostsSlice.reducer