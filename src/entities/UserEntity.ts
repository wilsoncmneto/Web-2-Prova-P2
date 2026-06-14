// @ts-nocheck
class UserEntity {
  constructor({ id, name, email, situationId, situation, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.situationId = situationId;
    this.situation = situation || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = UserEntity;
