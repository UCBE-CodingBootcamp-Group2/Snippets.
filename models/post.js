module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    snippetCategory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    snippetTag: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });
  return Post;
};
