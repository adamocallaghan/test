import { Mongo } from 'meteor/mongo';
// Collection Articles on Client / 'articles' on Server
export const Articles = new Mongo.Collection('articles');