'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let signedStudents = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            signedStudents.push({ event, context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            signedStudents = signedStudents.filter(signedStudent =>
                !signedStudent.event.startsWith(event) || signedStudent.context !== context);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let namespaces = getAllSubspace(event);
            let subscribers = signedStudents
                .filter(signedStudent => namespaces.includes(signedStudent.event))
                .sort((firstStudent, secondStudent) =>
                    firstStudent.event.length < secondStudent.event.length);
            for (let subscriber of subscribers) {
                subscriber.handler.call(subscriber.context);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function getAllSubspace(event) {
    if (event.length === 0) {
        return [];
    }

    let events = event.split('.');
    let namespaces = [];
    let currentNamespace = events[0];
    namespaces.push(currentNamespace);
    for (let i = 1; i < events.length; i++) {
        currentNamespace += '.' + events[i];
        namespaces.push(currentNamespace);
    }

    return namespaces;
}
