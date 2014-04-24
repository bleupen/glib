var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var Logger = require('../lib/');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('Logger', function () {
    it('should be constructable without new', function () {
        var log = Logger(['tag1', 'tag2']);
        should.exist(log);
        log.should.be.an.instanceOf(Logger);
        log.should.have.property('tags');
        log.tags.should.have.members(['tag1', 'tag2']);
    });

    it('should be constructable with new', function () {
        var log = new Logger(['tag1', 'tag2']);
        should.exist(log);
        log.should.be.an.instanceOf(Logger);
        log.should.have.property('tags');
        log.tags.should.have.members(['tag1', 'tag2']);
    });

    it('should create a logger with no default tags', function () {
        var log = Logger();
        log.should.have.property('tags');
        log.tags.should.have.length(0);
    });

    it('should log to the console', function () {
        var logger = Logger();
        logger.log(['tag1', 'tag2'], 'Test');
        logger.log('tag', 'Test');
        logger.log('Test');
    });

    it('should log info', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        logger.log = log;
        logger.info('Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'info'], 'Test');
    });

    it('should log error', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        logger.log = log;
        logger.error('Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'error'], 'Test');
    });

    it('should log warn', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        logger.log = log;
        logger.warn('Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'warn'], 'Test');
    });

    it('should log debug', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        logger.log = log;
        logger.debug('Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'debug'], 'Test');
    });

    it('should include runtime tags', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        logger.log = log;
        logger.info('extra', 'Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'extra', 'info'], 'Test');

        logger.info(['extra1', 'extra2'], 'Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'extra1', 'extra2', 'info'], 'Test');
    });

    it('should have a regsiter function', function () {
        Logger.should.have.haveOwnProperty('register');
        Logger.register.should.be.a('function');
    });

    it('should delegate to the plugins logger when registered as a hapi plugin', function () {
        var logger = new Logger(['tag1', 'tag2']);
        var log = sinon.spy();
        var plugin = {
            log: log
        };

        logger.info('Test');
        expect(log).not.to.have.been.called;

        var next = sinon.spy();
        Logger.register(plugin, {}, next);
        expect(next).to.have.been.calledOnce;
        logger.info('Test');
        expect(log).to.have.been.calledWith(['tag1', 'tag2', 'info'], 'Test');
    });
});