module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-aws-lambda');
    grunt.initConfig({
        lambda_invoke: { default: { options: { file_name: 'index.js' } } },
        lambda_package: { default: {} },
        lambda_deploy: { default: { arn: 'arn:aws:lambda:ap-southeast-1:993784152963:function:getOnePost' } }
    });
    grunt.registerTask('deploy', [
        'lambda_package',
        'lambda_deploy'
    ]);
};
