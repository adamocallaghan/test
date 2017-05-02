import { Mongo } from 'meteor/mongo';
// Collection Tasks on Client / 'tasks' on Server
export const Tasks = new Mongo.Collection('tasks');