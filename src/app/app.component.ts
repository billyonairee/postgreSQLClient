import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag'
import { Apollo } from 'apollo-angular'
// import { Post } from './post'
import { pluck, tap, map } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsGQL, AddPostGQL, PostGQL, DeletePostGQL, UpdatePostGQL } from './graphql/gragphql';
import { Post, Query, PostInput } from './graphql/gragphql';


type Post1 = (Post & { __typename: string })

type Data$ = Observable<{ data: { posts: Post1[] }, loading: boolean, networkStatus: number, stale: boolean }>


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private apollo: Apollo,
    private _snackBar: MatSnackBar,
    private postsGQL: PostsGQL,
    private postGQL: PostGQL,
    private addPostGQL: AddPostGQL,
    private deletePostGQL: DeletePostGQL,
    private updatePostGQL: UpdatePostGQL,
  ) { }

  post$: Observable<Post>;


  res$: Data$

  currentPost$ = this.apollo.watchQuery({
    query: getPosts
  })
    .valueChanges
    .pipe(
      pluck("data", "posts")
    )

  // postList$: Observable<PostsQuery>
  postList$: Observable<Post>
  // post$: Data$
  newPost$: Data$

  postIdByInput = 1;

  //Delete
  deletedPost$;
  deleteInput;

  //Add
  title;
  comment;

  ngOnInit() {
    this._getPostList()
  }

  // //Post List 
  // getPostList() {
  //   this.postList$ = this.apollo.watchQuery({
  //     query: getPosts
  //   })
  //     .valueChanges
  //     .pipe(
  //       pluck("data", "posts")
  //     )
  // }

  // //Post List By Id
  // getPostById() {
  //   this.post$ = this.apollo.watchQuery({
  //     query: getPost,
  //     variables: { 'postId': this.postIdByInput }
  //   })
  //     .valueChanges
  // }

  // //Add Post
  // addPost() {
  //   this.newPost$ = this.apollo.mutate({
  //     mutation: addPost,
  //     variables: {
  //       PostInput: {
  //         title: this.title,
  //         comment: this.comment
  //       }
  //     },
  //     update: (store, { data: { addPost } }) => {
  //       this._snackBar.open(`successful added ${addPost.title}`, "Add", {
  //         duration: 2000,
  //       });
  //       const data = store.readQuery({ query: getPosts })
  //       data.posts.push(addPost)
  //       store.writeQuery({ query: getPosts, data })
  //     }
  //   })
  // }

  // // Delete Post 
  // deletePost() {
  //   this.deletedPost$ = this.apollo.mutate({
  //     mutation: deletePost,
  //     variables: { postId: this.deleteInput },
  //     update: (store) => {
  //       const data = store.readQuery({ query: getPosts })
  //       const deletedIdx = data.posts.findIndex(i => Number(i.id) === this.deleteInput)
  //       data.posts.splice(deletedIdx, 1)
  //       store.writeQuery({ query: getPosts, data })
  //     }
  //   })
  // }

  // edit: boolean = false;
  // editBtn() {
  //   this.edit = true;
  // }

  // finishedEdit(id, title, comment) {
  //   this.edit = false;
  //   this.editPost(id, title, comment)
  // }

  // editedPost$;
  // editPost(id, title, comment) {
  //   this.editedPost$ = this.apollo.mutate({
  //     mutation: updatePost,
  //     variables: {
  //       PostInput: {
  //         id: id,
  //         title: title,
  //         comment: comment
  //       }
  //     },
  //     update: (store) => {
  //       const data = store.readQuery({ query: this.postsGQL.document })
  //       const editedIdx = data.posts.findIndex(i => i.id === id)
  //       Object.assign(data.posts[editedIdx], {
  //         id: id,
  //         title: title,
  //         comment: comment
  //       })
  //       store.writeQuery({ query: getPosts, data })
  //     }
  //   })
  // }


  //All
  loading$: Observable<boolean>
  selectedPost;
  postEditing = false;
  status = "default"
  _postList$: Observable<Post[]>;
  _title;
  _comment;
  _addedPost$: Observable<Post>;
  _deletedPost$;
  _editedPost$;

  _getPostList() {
    this._postList$ = this.postsGQL.watch().valueChanges.pipe(pluck("data", "posts"))
    this.loading$ = this.postsGQL.watch().valueChanges.pipe(pluck("loading")).pipe()
  }
  // of observable boolean

  _getPostById(id) {
    this.selectedPost = this.postGQL.watch({
      postId: Number(id)
    })
      .valueChanges
      .pipe(pluck("data", "post"))
  }

  _addPost() {
    this._addedPost$ = this.addPostGQL.mutate({
      PostInput: {
        title: this._title,
        comment: this._comment
      }
    },
      {
        update: (store, { data: { addPost } }) => {
          this._snackBar.open(`successful added ${addPost.title}`, "Add", {
            duration: 2000,
          });
          const data: Query = store.readQuery({ query: this.postsGQL.document })
          data.posts.push(addPost)
          store.writeQuery({ query: getPosts, data })
          this.selectedPost = addPost
          this.status = "detail"
        }
      }
    ).pipe(pluck("data", "addPost"))
  }

  _deletePost() {
    const deletedId = Number(this.selectedPost.id)
    this._deletedPost$ = this.deletePostGQL.mutate({
      postId: deletedId
    },
      {
        update: (store) => {
          const data: Query = store.readQuery({ query: this.postsGQL.document })
          const deletedIdx = data.posts.findIndex(i => Number(i.id) === deletedId)
          data.posts.splice(deletedIdx, 1)
          store.writeQuery({ query: getPosts, data })
        }
      }
    )
  }

  _editPost() {
    delete this.selectedPost.__typename
    this._editedPost$ = this.updatePostGQL.mutate({
      PostInput: this.selectedPost
    }, {
      update: (store) => {
        const data: Query = store.readQuery({ query: this.postsGQL.document })
        const editedIdx = data.posts.findIndex(i => i.id === this.selectedPost.id)
        Object.assign(data.posts[editedIdx], this.selectedPost, { __typename: "Post" })
        store.writeQuery({ query: getPosts, data })
      }
    })
  }



  clickPost(post) {
    // this._getPostById(postId)
    this.selectedPost = post
    this.status = "detail"

  }
  editing() {
    this.status = "editing"
    this.postEditing = !this.postEditing
  }
  goDefault() {
    this.status = "default"
  }
  postAdd() {
    this.status = "addPost"
  }
  postAddSave() {
    this._addPost()
    this._title = undefined;
    this._comment = undefined;
  }
  postDelete() {
    this._deletePost()
    this.goDefault()
  }
  postEditSave() {
    this._editPost()
    this.status = "detail"
  }

}

const getPosts = gql`
  query	posts
  {
    posts {
      id
      title
      comment
    }
  }`

const getPost = gql`
  query	post($postId: Int!)
  {
    post(postId: $postId) {
      title
      comment
    }
  }`

const addPost = gql`
  mutation addPost($PostInput: PostInput!){
  addPost(post: $PostInput){
    id
    title
    comment
  }
}`

const deletePost = gql`
  mutation deletePost($postId: Int!){
    deletePost(postId: $postId){
      affected
    }
  }
  `

const updatePost = gql`
  mutation updatePost($PostInput: PostInput!){
    updatePost(post: $PostInput){
      affected
    }
  }
  `
