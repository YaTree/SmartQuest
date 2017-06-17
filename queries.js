/**
 * Created by yatree on 30/05/17.
 */
var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

// const databaseConfig = {
//     "host": "localhost",
//     "port": 5432,
//     "database": "smart_quest",
//     "user": "postgres",
//     "password": "334675Ld!"
// };

const databaseConfig = {
    "host": "ec2-54-163-246-154.compute-1.amazonaws.com",
    "port": 5432,
    "database": "d6eupguttlqq1e",
    "user": "jpfwdvyczswbxi",
    "password": "41c337d3c32ea2f4d35e9fa36c0b8e9f28073ece068d38026aa66ab5a0d19e7f!"
};


var pgp = require('pg-promise')(options);
var db = pgp('postgres://jpfwdvyczswbxi:41c337d3c32ea2f4d35e9fa36c0b8e9f28073ece068d38026aa66ab5a0d19e7f@ec2-54-163-246-154.compute-1.amazonaws.com:5432/d6eupguttlqq1e');


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


//TODO add date converter
function convertToPostgresType(value) {
    if (isNumeric(value)) {
        return value;
    }

    return '\'' + value + '\'';
}

function pgInsertRequest(tableName, idFieldName, params) {
    var request = 'INSERT INTO ' + tableName;
    var requestFields = '(';
    var requestFieldsValues = 'VALUES(';
    var fieldList = Object.keys(params);

    for (var fieldIndex in fieldList) {
        requestFields += fieldList[fieldIndex] + ', ';
        requestFieldsValues += convertToPostgresType(params[fieldList[fieldIndex]]) + ', ';
    }

    requestFields = requestFields.slice(0, -2);
    requestFieldsValues = requestFieldsValues.slice(0, -2);
    request += requestFields + ') ' + requestFieldsValues + ') RETURNING ' + idFieldName;

    console.log(request);
    return request;
}

function pgUpdateRequest(tableName, idFieldName, params) {
    //update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    var request = 'UPDATE ' + tableName + ' SET ';
    var requestFields = '';
    //var requestFieldsValues = 'VALUES(';
    var fieldList = Object.keys(params);

    for (var fieldIndex in fieldList) {

        requestFields += fieldList[fieldIndex] + '=' + convertToPostgresType(params[fieldList[fieldIndex]]) + ', ';
        //  requestFieldsValues +=  convertToPostgresType(params[fieldList[fieldIndex]]) + ', ';
    }

    requestFields = requestFields.slice(0, -2);
    // requestFieldsValues = requestFieldsValues.slice(0, -2);
    request += requestFields + ' WHERE ' + idFieldName + '=$1';

    return request;
}

// Scenario API
function getAllScenarios(req, res, next) {
    db.any('select * from app.scenario')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL scenarios'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getScenarioById(req, res, next) {
    var scenarioID = parseInt(req.params.id);
    db.one('select * from app.scenario where scenario_id = $1', scenarioID)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved scenario by id=' + scenarioID
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
//TODO We need to parse parameters.
function createScenario(req, res, next) {
    //console.log(req.body);

    var pg_request = pgInsertRequest('app.scenario', 'scenario_id', req.body);

    console.log(pg_request);
    req.body.age = parseInt(req.body.age);
    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one scenario'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateScenario(req, res, next) {
    var pg_request = pgUpdateRequest('app.scenario', 'scenario_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated scenario'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeScenario(req, res, next) {
    var scenarioID = parseInt(req.params.id);
    db.result('delete from app.scenario where scenario_id = $1', scenarioID)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} scenario`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}
// END of Scenario API


// Stages API
function getAllStages(req, res, next) {
    db.any('select * from app.stages')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL stages'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getStageById(req, res, next) {
    var stageId = parseInt(req.params.id);
    db.one('select * from app.stages where stage_id = $1', stageId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved stage by id=' + stageId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createStage(req, res, next) {
    var pg_request = pgInsertRequest('app.stages', 'stage_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one stage'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateStage(req, res, next) {
    var pg_request = pgUpdateRequest('app.stages', 'stage_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated stage'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeStage(req, res, next) {
    var stageId = parseInt(req.params.id);
    db.result('delete from app.stages where stage_id = $1', stageId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} stage`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getStagesForScenario(req, res, next) {

    db.any('SELECT * FROM app.stages WHERE scenario_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
// END of Stages API


// tasks API
function getAllTasks(req, res, next) {
    db.any('select * from app.tasks')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL tasks'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getTaskById(req, res, next) {
    var taskId = parseInt(req.params.id);
    db.one('select * from app.tasks where task_id = $1', taskId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Task by id=' + taskId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createTask(req, res, next) {
    var pg_request = pgInsertRequest('app.tasks', 'task_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Task'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateTask(req, res, next) {
    var pg_request = pgUpdateRequest('app.tasks', 'task_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Task'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeTask(req, res, next) {
    var taskId = parseInt(req.params.id);
    db.result('delete from app.tasks where task_id = $1', taskId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Task`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getTasksForStage(req, res, next) {

    db.any('SELECT * FROM app.tasks WHERE stage_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// scripts API
function getAllScripts(req, res, next) {
    db.any('select * from app.scripts')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL scripts'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getScriptById(req, res, next) {
    var scriptId = parseInt(req.params.id);
    db.one('select * from app.scripts where script_id = $1', scriptId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Script by id=' + scriptId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createScript(req, res, next) {
    var pg_request = pgInsertRequest('app.scripts', 'script_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Script'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateScript(req, res, next) {
    var pg_request = pgUpdateRequest('app.scripts', 'script_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Script'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeScript(req, res, next) {
    var scriptId = parseInt(req.params.id);
    db.result('delete from app.scripts where script_id = $1', scriptId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Script`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getScriptsForTask(req, res, next) {

    db.any('SELECT * FROM app.scripts WHERE task_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// scenarioTeams API
function getAllScenarioTeams(req, res, next) {
    db.any('select * from app.scenarioTeams')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL scenarioTeams'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getScenarioTeamById(req, res, next) {
    var scenarioTeamId = parseInt(req.params.id);
    db.one('select * from app.scenarioTeams where scenario_team_id = $1', scenarioTeamId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ScenarioTeam by id=' + scenarioTeamId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createScenarioTeam(req, res, next) {
    var pg_request = pgInsertRequest('app.scenarioTeams', 'scenario_team_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one ScenarioTeam'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateScenarioTeam(req, res, next) {
    var pg_request = pgUpdateRequest('app.scenarioTeams', 'scenario_team_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated ScenarioTeam'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeScenarioTeam(req, res, next) {
    var scenarioTeamId = parseInt(req.params.id);
    db.result('delete from app.scenarioTeams where scenario_team_id = $1', scenarioTeamId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} ScenarioTeam`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getScenarioTeamsForScenario(req, res, next) {

    db.any('SELECT * FROM app.scenario_teams WHERE scenario_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// roles API
function getAllRoles(req, res, next) {
    db.any('select * from app.roles')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL roles'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getRoleById(req, res, next) {
    var roleId = parseInt(req.params.id);
    db.one('select * from app.roles where role_id = $1', roleId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Role by id=' + roleId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createRole(req, res, next) {
    var pg_request = pgInsertRequest('app.roles', 'role_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Role'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateRole(req, res, next) {
    var pg_request = pgUpdateRequest('app.roles', 'role_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Role'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeRole(req, res, next) {
    var roleId = parseInt(req.params.id);
    db.result('delete from app.roles where role_id = $1', roleId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Role`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getRolesForScenarioTeam(req, res, next) {

    db.any('SELECT * FROM app.roles WHERE scenario_team_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// hints API
function getAllHints(req, res, next) {
    db.any('select * from app.hints')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL hints'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHintById(req, res, next) {
    var hintId = parseInt(req.params.id);
    db.one('select * from app.hints where hint_id = $1', hintId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Hint by id=' + hintId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createHint(req, res, next) {
    var pg_request = pgInsertRequest('app.hints', 'hint_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Hint'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateHint(req, res, next) {
    var pg_request = pgUpdateRequest('app.hints', 'hint_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Hint'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeHint(req, res, next) {
    var hintId = parseInt(req.params.id);
    db.result('delete from app.hints where hint_id = $1', hintId)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Hint`
                });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHintsForTask(req, res, next) {

    db.any('SELECT * FROM app.hints WHERE task_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// facts API
function getAllFacts(req, res, next) {
    db.any('select * from app.facts')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL facts'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getFactById(req, res, next) {
    var factId = parseInt(req.params.id);
    db.one('select * from app.facts where fact_id = $1', factId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Fact by id=' + factId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createFact(req, res, next) {
    var pg_request = pgInsertRequest('app.facts', 'fact_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Fact'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateFact(req, res, next) {
    var pg_request = pgUpdateRequest('app.facts', 'fact_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Fact'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeFact(req, res, next) {
    var factId = parseInt(req.params.id);
    db.result('delete from app.facts where fact_id = $1', factId)
        .then(function (result) {
            /* jsfact ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Fact`
                });
            /* jsfact ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getFactsForScenario(req, res, next) {

    db.any('SELECT * FROM app.facts WHERE scenario_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// contents API
function getAllContents(req, res, next) {
    db.any('select * from app.contents')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL contents'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getContentById(req, res, next) {
    var contentId = parseInt(req.params.id);
    db.one('select * from app.contents where content_id = $1', contentId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Content by id=' + contentId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createContent(req, res, next) {
    var pg_request = pgInsertRequest('app.contents', 'content_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Content'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateContent(req, res, next) {
    var pg_request = pgUpdateRequest('app.contents', 'content_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Content'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeContent(req, res, next) {
    var contentId = parseInt(req.params.id);
    db.result('delete from app.contents where content_id = $1', contentId)
        .then(function (result) {
            /* jscontent ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Content`
                });
            /* jscontent ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getContentsForTask(req, res, next) {

    db.any('SELECT * FROM app.contents WHERE task_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// comments API
function getAllComments(req, res, next) {
    db.any('select * from app.comments')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL comments'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getCommentById(req, res, next) {
    var commentId = parseInt(req.params.id);
    db.one('select * from app.comments where comment_id = $1', commentId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Comment by id=' + commentId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createComment(req, res, next) {
    var pg_request = pgInsertRequest('app.comments', 'comment_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Comment'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateComment(req, res, next) {
    var pg_request = pgUpdateRequest('app.comments', 'comment_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Comment'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeComment(req, res, next) {
    var commentId = parseInt(req.params.id);
    db.result('delete from app.comments where comment_id = $1', commentId)
        .then(function (result) {
            /* jscomment ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Comment`
                });
            /* jscomment ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getCommentsForScenario(req, res, next) {

    db.any('SELECT * FROM app.comments WHERE scenario_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// answerOptions API
function getAllAnswerOptions(req, res, next) {
    db.any('select * from app.answer_options')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL answerOptions'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getAnswerOptionById(req, res, next) {
    var answerOptionId = parseInt(req.params.id);
    db.one('select * from app.answer_options where answer_option_id = $1', answerOptionId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved AnswerOption by id=' + answerOptionId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createAnswerOption(req, res, next) {
    var pg_request = pgInsertRequest('app.answer_options', 'answer_option_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one AnswerOption'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateAnswerOption(req, res, next) {
    var pg_request = pgUpdateRequest('app.answer_options', 'answer_option_id', req.body);

    console.log(pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated AnswerOption'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeAnswerOption(req, res, next) {
    var answerOptionId = parseInt(req.params.id);
    db.result('delete from app.answer_options where answer_option_id = $1', answerOptionId)
        .then(function (result) {
            /* jsanswerOption ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} AnswerOption`
                });
            /* jsanswerOption ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

function getAnswerOptionsForTask(req, res, next) {

    db.any('SELECT * FROM app.answer_options WHERE task_id = ' + req.params.id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: ''
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Users API
function getAllUsers(req, res, next) {
    db.any('select * from customer.user')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Users'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getUserById(req, res, next) {
    var userId = parseInt(req.params.id);
    db.one('select * from customer.user where user_id = $1', userId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved User by id='+userId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createUser(req, res, next) {
    var pg_request = pgInsertRequest ('customer.users', 'user_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one User'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateUser(req, res, next) {
    var pg_request = pgUpdateRequest('customer.users', 'user_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated User'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeUser(req, res, next) {
    var userId = parseInt(req.params.id);
    db.result('delete from customer.user where user_id = $1', userId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} User`
                });

        })
        .catch(function (err) {
            return next(err);
        });
}

function checkUser(req, res, next) {
    var userName = req.params.name;
    var userPassword = req.params.password;
    db.any("SELECT user_id FROM customer.users WHERE user_name = $0 and user_password = $1", [userName,userPassword])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: `Removed ${data.rowCount} User`
                });

        })
        .catch(function (err) {
            return next(err);
        });
}



// Teams API
function getAllTeams(req, res, next) {
    db.any('select * from customer.team')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Teams'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getTeamById(req, res, next) {
    var teamId = parseInt(req.params.id);
    db.one('select * from customer.team where team_id = $1', teamId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Team by id='+teamId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createTeam(req, res, next) {
    var pg_request = pgInsertRequest ('customer.teams', 'team_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Team'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateTeam(req, res, next) {
    var pg_request = pgUpdateRequest('customer.teams', 'team_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Team'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeTeam(req, res, next) {
    var teamId = parseInt(req.params.id);
    db.result('delete from customer.team where team_id = $1', teamId)
        .then(function (result) {
            /* jsanswerOption ignore:start */
            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Team`
                });
            /* jsanswerOption ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
}

// Orders API
function getAllOrders(req, res, next) {
    db.any('select * from customer.order')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Orders'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getOrderById(req, res, next) {
    var orderId = parseInt(req.params.id);
    db.one('select * from customer.order where order_id = $1', orderId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Order by id='+orderId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createOrder(req, res, next) {
    var pg_request = pgInsertRequest ('customer.orders', 'order_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Order'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateOrder(req, res, next) {
    var pg_request = pgUpdateRequest('customer.orders', 'order_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Order'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeOrder(req, res, next) {
    var orderId = parseInt(req.params.id);
    db.result('delete from customer.order where order_id = $1', orderId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Order`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Games API
function getAllGames(req, res, next) {
    db.any('select * from customer.game')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Games'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getGameById(req, res, next) {
    var gameId = parseInt(req.params.id);
    db.one('select * from customer.game where game_id = $1', gameId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Game by id='+gameId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createGame(req, res, next) {
    var pg_request = pgInsertRequest ('customer.game', 'game_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Game'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateGame(req, res, next) {
    var pg_request = pgUpdateRequest('customer.game', 'game_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Game'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeGame(req, res, next) {
    var gameId = parseInt(req.params.id);
    db.result('delete from customer.game where game_id = $1', gameId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Game`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Games2Users API
function getAllGames2Users(req, res, next) {
    db.any('select * from customer.games2users')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Games2Userss'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getGames2UsersById(req, res, next) {
    var games2usersId = parseInt(req.params.id);
    db.one('select * from customer.games2users where games2users_id = $1', games2usersId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Games2Users by id='+games2usersId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createGames2Users(req, res, next) {
    var pg_request = pgInsertRequest ('customer.games2users', 'games2users_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Games2Users'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateGames2Users(req, res, next) {
    var pg_request = pgUpdateRequest('customer.games2users', 'games2users_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Games2Users'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeGames2Users(req, res, next) {
    var games2usersId = parseInt(req.params.id);
    db.result('delete from customer.games2users where games2users_id = $1', games2usersId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Games2Users`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Games2Teams API
function getAllGames2Teams(req, res, next) {
    db.any('select * from customer.games2teams')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Games2Teamss'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getGames2TeamsById(req, res, next) {
    var games2teamsId = parseInt(req.params.id);
    db.one('select * from customer.games2teams where games2teams_id = $1', games2teamsId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Games2Teams by id='+games2teamsId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createGames2Teams(req, res, next) {
    var pg_request = pgInsertRequest ('customer.games2teams', 'games2teams_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Games2Teams'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateGames2Teams(req, res, next) {
    var pg_request = pgUpdateRequest('customer.games2teams', 'games2teams_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Games2Teams'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeGames2Teams(req, res, next) {
    var games2teamsId = parseInt(req.params.id);
    db.result('delete from customer.games2teams where games2teams_id = $1', games2teamsId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Games2Teams`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Messages API
function getAllMessages(req, res, next) {
    db.any('select * from stuff.messages')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ALL Messages'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getMessageById(req, res, next) {
    var messageId = parseInt(req.params.id);
    db.one('select * from stuff.messages where message_id = $1', messageId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved Message by id='+messageId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createMessage(req, res, next) {
    var pg_request = pgInsertRequest ('stuff.messages', 'message_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Inserted one Message'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateMessage(req, res, next) {
    var pg_request = pgUpdateRequest('stuff.messages', 'message_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    message: 'Updated Message'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeMessage(req, res, next) {
    var messageId = parseInt(req.params.id);
    db.result('delete from stuff.messages where message_id = $1', messageId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    message: `Removed ${result.rowCount} Message`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// Chats API
function getAllChats(req, res, next) {
    db.any('select * from stuff.chats')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    chat: 'Retrieved ALL Chats'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getChatById(req, res, next) {
    var chatId = parseInt(req.params.id);
    db.one('select * from stuff.chats where chat_id = $1', chatId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    chat: 'Retrieved Chat by id='+chatId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createChat(req, res, next) {
    var pg_request = pgInsertRequest ('stuff.chats', 'chat_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    chat: 'Inserted one Chat'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateChat(req, res, next) {
    var pg_request = pgUpdateRequest('stuff.chats', 'chat_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    chat: 'Updated Chat'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeChat(req, res, next) {
    var chatId = parseInt(req.params.id);
    db.result('delete from stuff.chats where chat_id = $1', chatId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    chat: `Removed ${result.rowCount} Chat`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

// News API
function getAllNews(req, res, next) {
    db.any('select * from stuff.news')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    news: 'Retrieved ALL News'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getNewsById(req, res, next) {
    var noveltyId = parseInt(req.params.id);
    db.one('select * from stuff.news where novelty_id = $1', noveltyId)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    news: 'Retrieved News by id='+noveltyId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createNews(req, res, next) {
    var pg_request = pgInsertRequest ('stuff.news', 'novelty_id', req.body);

    db.one(pg_request)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    news: 'Inserted one News'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateNews(req, res, next) {
    var pg_request = pgUpdateRequest('stuff.news', 'novelty_id', req.body);

    console.log (pg_request);
    db.none(pg_request, [parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'success',
                    news: 'Updated News'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function removeNews(req, res, next) {
    var noveltyId = parseInt(req.params.id);
    db.result('delete from stuff.news where novelty_id = $1', noveltyId)
        .then(function (result) {

            res.status(200)
                .json({
                    status: 'success',
                    news: `Removed ${result.rowCount} News`
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

module.exports = {
    // Scenario API
    getAllScenarios: getAllScenarios,
    getScenarioById: getScenarioById,
    createScenario: createScenario,
    updateScenario: updateScenario,
    removeScenario: removeScenario,

    // Stage API
    getAllStages: getAllStages,
    getStageById: getStageById,
    createStage: createStage,
    updateStage: updateStage,
    removeStage: removeStage,
    getStagesForScenario: getStagesForScenario,

    // Task API
    getAllTasks: getAllTasks,
    getTaskById: getTaskById,
    createTask: createTask,
    updateTask: updateTask,
    removeTask: removeTask,
    getTasksForStage: getTasksForStage,

    // Script API
    getAllScripts: getAllScripts,
    getScriptById: getScriptById,
    createScript: createScript,
    updateScript: updateScript,
    removeScript: removeScript,
    getScriptsForTask: getScriptsForTask,

    // ScenarioTeam API
    getAllScenarioTeams: getAllScenarioTeams,
    getScenarioTeamById: getScenarioTeamById,
    createScenarioTeam: createScenarioTeam,
    updateScenarioTeam: updateScenarioTeam,
    removeScenarioTeam: removeScenarioTeam,
    getScenarioTeamsForScenario: getScenarioTeamsForScenario,

    // Role API
    getAllRoles: getAllRoles,
    getRoleById: getRoleById,
    createRole: createRole,
    updateRole: updateRole,
    removeRole: removeRole,
    getRolesForScenarioTeam: getRolesForScenarioTeam,

    // Hint API
    getAllHints: getAllHints,
    getHintById: getHintById,
    createHint: createHint,
    updateHint: updateHint,
    removeHint: removeHint,
    getHintsForTask: getHintsForTask,

    // Fact API
    getAllFacts: getAllFacts,
    getFactById: getFactById,
    createFact: createFact,
    updateFact: updateFact,
    removeFact: removeFact,
    getFactsForScenario: getFactsForScenario,

    // Content API
    getAllContents: getAllContents,
    getContentById: getContentById,
    createContent: createContent,
    updateContent: updateContent,
    removeContent: removeContent,
    getContentsForTask: getContentsForTask,

    // Comment API
    getAllComments: getAllComments,
    getCommentById: getCommentById,
    createComment: createComment,
    updateComment: updateComment,
    removeComment: removeComment,
    getCommentsForScenario: getCommentsForScenario,

    // AnswerOption API
    getAllAnswerOptions: getAllAnswerOptions,
    getAnswerOptionById: getAnswerOptionById,
    createAnswerOption: createAnswerOption,
    updateAnswerOption: updateAnswerOption,
    removeAnswerOption: removeAnswerOption,
    getAnswerOptionsForTask: getAnswerOptionsForTask,

    // User API
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser,
    checkUser: checkUser,

    // Team API
    getAllTeams: getAllTeams,
    getTeamById: getTeamById,
    createTeam: createTeam,
    updateTeam: updateTeam,
    removeTeam: removeTeam,

    // Order API
    getAllOrders: getAllOrders,
    getOrderById: getOrderById,
    createOrder: createOrder,
    updateOrder: updateOrder,
    removeOrder: removeOrder,

    // Game API
    getAllGames: getAllGames,
    getGameById: getGameById,
    createGame: createGame,
    updateGame: updateGame,
    removeGame: removeGame,

    // Games2Users API
    getAllGames2Users: getAllGames2Users,
    getGames2UsersById: getGames2UsersById,
    createGames2Users: createGames2Users,
    updateGames2Users: updateGames2Users,
    removeGames2Users: removeGames2Users,

    // Games2Teams API
    getAllGames2Teams: getAllGames2Teams,
    getGames2TeamsById: getGames2TeamsById,
    createGames2Teams: createGames2Teams,
    updateGames2Teams: updateGames2Teams,
    removeGames2Teams: removeGames2Teams,

    // Chat API
    getAllChats: getAllChats,
    getChatById: getChatById,
    createChat: createChat,
    updateChat: updateChat,
    removeChat: removeChat,

    // Message API
    getAllMessages: getAllMessages,
    getMessageById: getMessageById,
    createMessage: createMessage,
    updateMessage: updateMessage,
    removeMessage: removeMessage,

    // News API
    getAllNews: getAllNews,
    getNewsById: getNewsById,
    createNews: createNews,
    updateNews: updateNews,
    removeNews: removeNews,
};