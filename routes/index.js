var express = require('express');
var router = express.Router();

var db = require('../queries');

// Routing Scenario API
router.get('/api/v1/scenarios', db.getAllScenarios);
router.get('/api/v1/scenarios/:id', db.getScenarioById);
router.post('/api/v1/scenarios', db.createScenario);
router.put('/api/v1/scenarios/:id', db.updateScenario);
router.delete('/api/v1/scenarios/:id', db.removeScenario);

// Routing Stages API
router.get('/api/v1/stages', db.getAllStages);
router.get('/api/v1/stages/:id', db.getStageById);
router.post('/api/v1/stages', db.createStage);
router.put('/api/v1/stages/:id', db.updateStage);
router.delete('/api/v1/stages/:id', db.removeStage);
router.get('/api/v1/scenarios/:id/stages', db.getStagesForScenario);

// Routing Tasks API
router.get('/api/v1/tasks', db.getAllTasks);
router.get('/api/v1/tasks/:id', db.getTaskById);
router.post('/api/v1/tasks', db.createTask);
router.put('/api/v1/tasks/:id', db.updateTask);
router.delete('/api/v1/tasks/:id', db.removeTask);
router.get('/api/v1/stages/:id/tasks', db.getTasksForStage);

// Routing Scripts API
router.get('/api/v1/scripts', db.getAllScripts);
router.get('/api/v1/scripts/:id', db.getScriptById);
router.post('/api/v1/scripts', db.createScript);
router.put('/api/v1/scripts/:id', db.updateScript);
router.delete('/api/v1/scripts/:id', db.removeScript);
router.get('/api/v1/tasks/:id/scripts', db.getScriptsForTask);

// Routing ScenarioTeams API
router.get('/api/v1/scenarioTeams', db.getAllScenarioTeams);
router.get('/api/v1/scenarioTeams/:id', db.getScenarioTeamById);
router.post('/api/v1/scenarioTeams', db.createScenarioTeam);
router.put('/api/v1/scenarioTeams/:id', db.updateScenarioTeam);
router.delete('/api/v1/scenarioTeams/:id', db.removeScenarioTeam);
router.get('/api/v1/scenarios/:id/scenarioTeams', db.getScenarioTeamsForScenario);

// Routing Roles API
router.get('/api/v1/roles', db.getAllRoles);
router.get('/api/v1/roles/:id', db.getRoleById);
router.post('/api/v1/roles', db.createRole);
router.put('/api/v1/roles/:id', db.updateRole);
router.delete('/api/v1/roles/:id', db.removeRole);
router.get('/api/v1/scenarioTeams/:id/roles', db.getRolesForScenarioTeam);

// Routing Hints API
router.get('/api/v1/hints', db.getAllHints);
router.get('/api/v1/hints/:id', db.getHintById);
router.post('/api/v1/hints', db.createHint);
router.put('/api/v1/hints/:id', db.updateHint);
router.delete('/api/v1/hints/:id', db.removeHint);
router.get('/api/v1/tasks/:id/hints', db.getHintsForTask);

// Routing Facts API
router.get('/api/v1/facts', db.getAllFacts);
router.get('/api/v1/facts/:id', db.getFactById);
router.post('/api/v1/facts', db.createFact);
router.put('/api/v1/facts/:id', db.updateFact);
router.delete('/api/v1/facts/:id', db.removeFact);
router.get('/api/v1/scenarios/:id/facts', db.getFactsForScenario);

// Routing Contents API
router.get('/api/v1/contents', db.getAllContents);
router.get('/api/v1/contents/:id', db.getContentById);
router.post('/api/v1/contents', db.createContent);
router.put('/api/v1/contents/:id', db.updateContent);
router.delete('/api/v1/contents/:id', db.removeContent);
router.get('/api/v1/tasks/:id/contents', db.getContentsForTask);

// Routing Comments API
router.get('/api/v1/comments', db.getAllComments);
router.get('/api/v1/comments/:id', db.getCommentById);
router.post('/api/v1/comments', db.createComment);
router.put('/api/v1/comments/:id', db.updateComment);
router.delete('/api/v1/comments/:id', db.removeComment);
router.get('/api/v1/scenarios/:id/comments', db.getCommentsForScenario);

// Routing AnswerOptions API
router.get('/api/v1/answerOptions', db.getAllAnswerOptions);
router.get('/api/v1/answerOptions/:id', db.getAnswerOptionById);
router.post('/api/v1/answerOptions', db.createAnswerOption);
router.put('/api/v1/answerOptions/:id', db.updateAnswerOption);
router.delete('/api/v1/answerOptions/:id', db.removeAnswerOption);
router.get('/api/v1/tasks/:id/answerOptions', db.getAnswerOptionsForTask);

// Routing Messages API
router.get('/api/v1/messages', db.getAllMessages);
router.get('/api/v1/messages/:id', db.getMessageById);
router.post('/api/v1/messages', db.createMessage);
router.put('/api/v1/messages/:id', db.updateMessage);
router.delete('/api/v1/messages/:id', db.removeMessage);
// Routing Chats API
router.get('/api/v1/chats', db.getAllChats);
router.get('/api/v1/chats/:id', db.getChatById);
router.post('/api/v1/chats', db.createChat);
router.put('/api/v1/chats/:id', db.updateChat);
router.delete('/api/v1/chats/:id', db.removeChat);
// Routing News API
router.get('/api/v1/news', db.getAllNews);
router.get('/api/v1/news/:id', db.getNewsById);
router.post('/api/v1/news', db.createNews);
router.put('/api/v1/news/:id', db.updateNews);
router.delete('/api/v1/news/:id', db.removeNews);
// Routing Users API
router.get('/api/v1/users', db.getAllUsers);
router.get('/api/v1/users/:id', db.getUserById);
router.post('/api/v1/users', db.createUser);
router.put('/api/v1/users/:id', db.updateUser);
router.delete('/api/v1/users/:id', db.removeUser);
// Routing Teams API
router.get('/api/v1/teams', db.getAllTeams);
router.get('/api/v1/teams/:id', db.getTeamById);
router.post('/api/v1/teams', db.createTeam);
router.put('/api/v1/teams/:id', db.updateTeam);
router.delete('/api/v1/teams/:id', db.removeTeam);

// Routing Orders API
router.get('/api/v1/orders', db.getAllOrders);
router.get('/api/v1/orders/:id', db.getOrderById);
router.post('/api/v1/orders', db.createOrder);
router.put('/api/v1/orders/:id', db.updateOrder);
router.delete('/api/v1/orders/:id', db.removeOrder);

// Routing Games API
router.get('/api/v1/games', db.getAllGames);
router.get('/api/v1/games/:id', db.getGameById);
router.post('/api/v1/games', db.createGame);
router.put('/api/v1/games/:id', db.updateGame);
router.delete('/api/v1/games/:id', db.removeGame);

// Routing Games2Users API
router.get('/api/v1/games2users', db.getAllGames2Users);
router.get('/api/v1/games2users/:id', db.getGames2UsersById);
router.post('/api/v1/games2users', db.createGames2Users);
router.put('/api/v1/games2users/:id', db.updateGames2Users);
router.delete('/api/v1/games2users/:id', db.removeGames2Users);


// Routing Games2Teams API
router.get('/api/v1/games2teams', db.getAllGames2Teams);
router.get('/api/v1/games2teams/:id', db.getGames2TeamsById);
router.post('/api/v1/games2teams', db.createGames2Teams);
router.put('/api/v1/games2teams/:id', db.updateGames2Teams);
router.delete('/api/v1/games2teams/:id', db.removeGames2Teams);

//router.get('/api/puppies', db.getAllPuppies);
// router.get('/api/puppies/:id', db.getSinglePuppy);
// router.post('/api/puppies', db.createPuppy);
// router.put('/api/puppies/:id', db.updatePuppy);
// router.delete('/api/puppies/:id', db.removePuppy);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
