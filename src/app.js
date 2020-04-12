const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } =  request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({ error: 'Repository Id does not exists'});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs} = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    }

    repositories.push(repository)

    return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId , (request, response) => {
  const { title, url, techs} = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);


  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  repositories[repositoryIndex].likes ++;

  return response.json(repositories[repositoryIndex])

});

module.exports = app;
