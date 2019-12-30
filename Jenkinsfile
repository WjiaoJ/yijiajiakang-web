#!/usr/bin/groovy
@Library('groot@master')
def version = determineVersion()

node {
    genericPipeline(
	version: version,

	build: {
            sh '/usr/local/bin/npm i --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist'

            sh '/usr/local/bin/npm run build'

            buildImageViaRemote(projectName: getProjectName(),
                version: version,
                files: "dist Dockerfile nginx.conf");
       }
    )
}
