const { ObjectId } = require('mongodb');
const connection = require('../../config/configMongo');

const COLLECTION_NAME = 'webchat';

const create = async ({ client, text, date, from }) => {
  const newMessage = await connection().then((db) =>
    db.collection(COLLECTION_NAME)
      .insertOne({
        client,
        timeLastMessage: date,
        messages: [{ text, date, from }],
      }));

  return newMessage;
};
const update = async ({ _id, timeLastMessage, newMessage }) => {
  const { modifiedCount } = await connection().then((db) =>
    db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: ObjectId(_id) },
        {
          $set: { timeLastMessage },
          $push: { messages: newMessage },
        },
      ));
  if (modifiedCount) {
    return await findById(_id);
  }
  return null;
  
};

const findById = async (id) => {
  const chat = await connection().then((db) =>
    db.collection(COLLECTION_NAME)
      .findOne({
        _id: id,
      }));
    // console.log(chat)
  return chat;
};

const findByEmail = async (email) => {
  const chat = await connection().then((db) =>
    db.collection(COLLECTION_NAME)
      .findOne({
        client: email,
      }));
    // console.log(chat)
  return chat;
};

const findAll = async () => {
  const chat = await connection().then((db) => 
    db.collection(COLLECTION_NAME).find().toArray());
  return chat;
};

module.exports = {
  create,
  findByEmail,
  update,
  findAll,
};