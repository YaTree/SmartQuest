/**
 * Created by yatree on 30/05/17.
 */
var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

const databaseConfig= {
    "host": "localhost",
    "port": 5432,
    "database": "smart_quest",
    "user": "postgres",
    "password": "334675Ld!"
};

var pgp = require('pg-promise')(options);
var db = pgp(databaseConfig);


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

function pgInsertRequest(tableName, idFieldName ,params) {
    var request = 'INSERT INTO ' + tableName;
    var requestFields = '(';
    var requestFieldsValues = 'VALUES(';
    var fieldList = Object.keys(params);

    for (var fieldIndex in fieldList) {
        requestFields += fieldList[fieldIndex] + ', ';
        requestFieldsValues +=  convertToPostgresType(params[fieldList[fieldIndex]]) + ', ';
    }

    requestFields = requestFields.slice(0, -2);
    requestFieldsValues = requestFieldsValues.slice(0, -2);
    request+=requestFields + ') ' + requestFieldsValues + ') RETURNING ' + idFieldName;

    console.log (request);
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
    request+=requestFields +  ' WHERE ' + idFieldName + '=$1';

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
                    message: 'Retrieved scenario by id='+scenarioID
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
//TODO We need to parse parameters.
function createScenario(req, res, next) {
    //console.log(req.body);

    var pg_request = pgInsertRequest ('app.scenario', 'scenario_id', req.body);

    console.log (pg_request);
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

    console.log (pg_request);
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
                    message: 'Retrieved stage by id='+stageId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createStage(req, res, next) {
    var pg_request = pgInsertRequest ('app.stages', 'stage_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Task by id='+taskId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createTask(req, res, next) {
    var pg_request = pgInsertRequest ('app.tasks', 'task_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Script by id='+scriptId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createScript(req, res, next) {
    var pg_request = pgInsertRequest ('app.scripts', 'script_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved ScenarioTeam by id='+scenarioTeamId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createScenarioTeam(req, res, next) {
    var pg_request = pgInsertRequest ('app.scenarioTeams', 'scenario_team_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Role by id='+roleId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createRole(req, res, next) {
    var pg_request = pgInsertRequest ('app.roles', 'role_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Hint by id='+hintId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createHint(req, res, next) {
    var pg_request = pgInsertRequest ('app.hints', 'hint_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Fact by id='+factId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createFact(req, res, next) {
    var pg_request = pgInsertRequest ('app.facts', 'fact_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Content by id='+contentId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createContent(req, res, next) {
    var pg_request = pgInsertRequest ('app.contents', 'content_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved Comment by id='+commentId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createComment(req, res, next) {
    var pg_request = pgInsertRequest ('app.comments', 'comment_id', req.body);

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

    console.log (pg_request);
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
                    message: 'Retrieved AnswerOption by id='+answerOptionId
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function createAnswerOption(req, res, next) {
    var pg_request = pgInsertRequest ('app.answer_options', 'answer_option_id', req.body);

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

    console.log (pg_request);
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
};