import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};




export type DResult = {
   __typename?: 'DResult',
  affected: Scalars['Float'],
};

export type Mutation = {
   __typename?: 'Mutation',
  addRecipe: Recipe,
  rate: Recipe,
  addPost: Post,
  deletePost: DResult,
  updatePost?: Maybe<UResult>,
};


export type MutationAddRecipeArgs = {
  recipe: RecipeInput
};


export type MutationRateArgs = {
  rate: RateInput
};


export type MutationAddPostArgs = {
  post: PostInput
};


export type MutationDeletePostArgs = {
  postId: Scalars['Int']
};


export type MutationUpdatePostArgs = {
  post: PostInput
};

export type Post = {
   __typename?: 'Post',
  id: Scalars['ID'],
  title: Scalars['String'],
  comment: Scalars['String'],
};

export type PostInput = {
  id?: Maybe<Scalars['String']>,
  title: Scalars['String'],
  comment: Scalars['String'],
  completed?: Maybe<Scalars['Boolean']>,
};

export type Query = {
   __typename?: 'Query',
  recipe?: Maybe<Recipe>,
  recipes: Array<Recipe>,
  posts: Array<Post>,
  post?: Maybe<Post>,
};


export type QueryRecipeArgs = {
  recipeId: Scalars['Int']
};


export type QueryPostArgs = {
  postId: Scalars['Int']
};

export type Rate = {
   __typename?: 'Rate',
  value: Scalars['Int'],
  user: User,
  date: Scalars['DateTime'],
};

export type RateInput = {
  recipeId: Scalars['ID'],
  value: Scalars['Int'],
};

export type Recipe = {
   __typename?: 'Recipe',
  id: Scalars['ID'],
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  ratings: Array<Rate>,
  author: User,
};

export type RecipeInput = {
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
};

export type UResult = {
   __typename?: 'UResult',
  affected: Scalars['Float'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  email: Scalars['String'],
  nickname?: Maybe<Scalars['String']>,
  recipes: Array<Recipe>,
};
export type PostsQueryVariables = {};


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'comment'>
  )> }
);

export type PostQueryVariables = {
  postId: Scalars['Int']
};


export type PostQuery = (
  { __typename?: 'Query' }
  & { post: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'comment'>
  )> }
);

export type AddPostMutationVariables = {
  PostInput: PostInput
};


export type AddPostMutation = (
  { __typename?: 'Mutation' }
  & { addPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'comment'>
  ) }
);

export type DeletePostMutationVariables = {
  postId: Scalars['Int']
};


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & { deletePost: (
    { __typename?: 'DResult' }
    & Pick<DResult, 'affected'>
  ) }
);

export type UpdatePostMutationVariables = {
  PostInput: PostInput
};


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: Maybe<(
    { __typename?: 'UResult' }
    & Pick<UResult, 'affected'>
  )> }
);

export const PostsDocument = gql`
    query Posts {
  posts {
    id
    title
    comment
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PostsGQL extends Apollo.Query<PostsQuery, PostsQueryVariables> {
    document = PostsDocument;
    
  }
export const PostDocument = gql`
    query post($postId: Int!) {
  post(postId: $postId) {
    id
    title
    comment
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PostGQL extends Apollo.Query<PostQuery, PostQueryVariables> {
    document = PostDocument;
    
  }
export const AddPostDocument = gql`
    mutation addPost($PostInput: PostInput!) {
  addPost(post: $PostInput) {
    id
    title
    comment
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddPostGQL extends Apollo.Mutation<AddPostMutation, AddPostMutationVariables> {
    document = AddPostDocument;
    
  }
export const DeletePostDocument = gql`
    mutation deletePost($postId: Int!) {
  deletePost(postId: $postId) {
    affected
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePostGQL extends Apollo.Mutation<DeletePostMutation, DeletePostMutationVariables> {
    document = DeletePostDocument;
    
  }
export const UpdatePostDocument = gql`
    mutation updatePost($PostInput: PostInput!) {
  updatePost(post: $PostInput) {
    affected
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdatePostGQL extends Apollo.Mutation<UpdatePostMutation, UpdatePostMutationVariables> {
    document = UpdatePostDocument;
    
  }