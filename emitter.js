'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
            signedStudents.push({
                event, context, handler, plannedCount: -1, currentCount: 0,
                frequency: -1
            });

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
                !((signedStudent.event.startsWith(event + '.') ||
                signedStudent.event === event) &&
                signedStudent.context === context));

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
                if (subscriber.plannedCount === -1) {
                    handleSubscriber(subscriber);
                    continue;
                }
                if (subscriber.plannedCount > 0) {
                    subscriber.handler.call(subscriber.context);
                    subscriber.plannedCount--;
                    continue;
                }
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            signedStudents.push({
                event, context, handler, plannedCount: times, currentCount: 0,
                frequency: -1
            });

            return this;

        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            signedStudents.push({
                event, context, handler, plannedCount: -1, currentCount: 0,
                frequency: frequency
            });

            return this;
        }
    };
}

function getAllSubspace(event) {
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

function handleSubscriber(subscriber) {
    if (subscriber.frequency === -1) {
        subscriber.handler.call(subscriber.context);
        subscriber.currentCount++;
    } else {
        if (subscriber.currentCount % subscriber.frequency === 0) {
            subscriber.handler.call(subscriber.context);
        }
        subscriber.currentCount++;
    }
}
