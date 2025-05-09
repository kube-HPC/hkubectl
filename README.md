# hkubectl  
  
## Install  
```shell  
curl -Lo hkubectl https://github.com/kube-HPC/hkubectl/releases/latest/download/hkubectl-linux \
&& chmod +x hkubectl \
&& sudo mv hkubectl /usr/local/bin/  
```  
## Usage  
## hkubectl  
---  
```shell  
$ hkubectl [ command ]  
```  
    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--version|Show version number|boolean|||  
|--rejectUnauthorized|set to false to ignore certificate signing errors. Useful for self signed TLS certificate|boolean|||  
|--endpoint|url of hkube api endpoint|string|||  
|--pathPrefix|path prefix url of hkube api endpoint  |string||/hkube/api-server/|  
|--dataSourcePathPrefix|path prefix url of hkube api endpoint  |string||/hkube/datasources-service/|  
|--verbose|verbose logging|boolean|||  
|-j, --json|output json to stdout|boolean|||  
|--help|Show help|boolean|||  
### exec  
---  
```shell  
$ hkubectl exec < command >  
```  
Execution pipelines as raw or stored    
#### get  
  
```shell  
$ hkubectl exec get < jobId >  
```  
Returns the executed pipeline data    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### raw  
  
```shell  
$ hkubectl exec raw   
```  
execute raw pipeline from file    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-f, --file|file path/name for running pipeline. use - to read from stdin|string|true||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
#### stored  
  
```shell  
$ hkubectl exec stored [ name ]  
```  
execute pipeline by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|-f, --file|file path/name for running pipeline|string|||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
#### stop  
  
```shell  
$ hkubectl exec stop   
```  
call to stop pipeline execution    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
|reason|Reason for stopping the pipeline|string|||  
#### status  
  
```shell  
$ hkubectl exec status < jobId >  
```  
Returns a status for the current pipeline    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### result  
  
```shell  
$ hkubectl exec result < jobId >  
```  
returns result for the execution of a specific pipeline run    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### algorithm  
  
```shell  
$ hkubectl exec algorithm [ name ]  
```  
execute algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|-f, --file|file path/name for extra data|string|||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
### export  
---  
```shell  
$ hkubectl export   
```  
Export all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl export all < outputDirectory >  
```  
Get and save all algorithms/pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|Path of your directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
#### algorithms  
  
```shell  
$ hkubectl export algorithms < outputDirectory >  
```  
get and save all algorithms as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g., json, yaml)  |string||json|  
#### pipelines  
  
```shell  
$ hkubectl export pipelines < outputDirectory >  
```  
get and save all pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
### export  
---  
```shell  
$ hkubectl export   
```  
Export all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl export all < outputDirectory >  
```  
Get and save all algorithms/pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|Path of your directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
#### algorithms  
  
```shell  
$ hkubectl export algorithms < outputDirectory >  
```  
get and save all algorithms as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g., json, yaml)  |string||json|  
#### pipelines  
  
```shell  
$ hkubectl export pipelines < outputDirectory >  
```  
get and save all pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
### export  
---  
```shell  
$ hkubectl export   
```  
Export all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl export all < outputDirectory >  
```  
Get and save all algorithms/pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|Path of your directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
#### algorithms  
  
```shell  
$ hkubectl export algorithms < outputDirectory >  
```  
get and save all algorithms as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g., json, yaml)  |string||json|  
#### pipelines  
  
```shell  
$ hkubectl export pipelines < outputDirectory >  
```  
get and save all pipelines as JSON/YAML files in a chosen directory    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|outputDirectory|path/of/your/directory|string|true||  
|-f, --format|Output format (e.g. json, yaml)  |string||json|  
### import  
---  
```shell  
$ hkubectl import   
```  
Import all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl import all < inputDirectory >  
```  
Import your algorithms/pipelines files from a chosen directory to your Hkube
environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --registry|docker registry for importing algorithms (e.g docker.io, myInternalRegistry)|string|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### algorithms  
  
```shell  
$ hkubectl import algorithms < inputDirectory >  
```  
Import your algorithms from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --replace|Replace a value like docker registry|(e.g docker.io, myInternalRegistry)|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### pipelines  
  
```shell  
$ hkubectl import pipelines < inputDirectory >  
```  
Import your pipelines from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
### import  
---  
```shell  
$ hkubectl import   
```  
Import all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl import all < inputDirectory >  
```  
Import your algorithms/pipelines files from a chosen directory to your Hkube
environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --registry|docker registry for importing algorithms (e.g docker.io, myInternalRegistry)|string|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### algorithms  
  
```shell  
$ hkubectl import algorithms < inputDirectory >  
```  
Import your algorithms from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --replace|Replace a value like docker registry|(e.g docker.io, myInternalRegistry)|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### pipelines  
  
```shell  
$ hkubectl import pipelines < inputDirectory >  
```  
Import your pipelines from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
### import  
---  
```shell  
$ hkubectl import   
```  
Import all pipelines to source environment    
#### all  
  
```shell  
$ hkubectl import all < inputDirectory >  
```  
Import your algorithms/pipelines files from a chosen directory to your Hkube
environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --registry|docker registry for importing algorithms (e.g docker.io, myInternalRegistry)|string|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### algorithms  
  
```shell  
$ hkubectl import algorithms < inputDirectory >  
```  
Import your algorithms from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
|-r, --replace|Replace a value like docker registry|(e.g docker.io, myInternalRegistry)|||  
|--overwrite, --or|Should overwrite exsiting algorithms|boolean|||  
#### pipelines  
  
```shell  
$ hkubectl import pipelines < inputDirectory >  
```  
Import your pipelines from a chosen directory to your Hkube environment    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|inputDirectory|path/of/your/directory|string|true||  
### algorithm  
---  
```shell  
$ hkubectl algorithm < command >  
```  
Manage loaded algorithms    
#### apply  
  
```shell  
$ hkubectl algorithm apply [ name ]  
```  
apply an algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|-f, --file|the algorithm file|string|||  
|--env|the algorithm env  [choices: "python", "nodejs", "java"]|string|||  
|--codePath|the code path for the algorithm|string|||  
|--codeEntryPoint, --entryPoint|the code entry point for the algorithm |string|||  
|--image, --algorithmImage|set algorithm image|string|||  
|--cpu|CPU requirements of the algorithm in cores |number|||  
|--gpu|GPU requirements of the algorithm in cores |number|||  
|--mem|memory requirements of the algorithm. Possible units are ['Mi', 'Gi']. Minimum is 4Mi|string|||  
|--noWait|if true, does not wait for the build to finish|boolean||false|  
|--setCurrent|if true, sets the new version as the current version  |boolean||false|  
#### list  
  
```shell  
$ hkubectl algorithm list   
```  
Lists all registered algorithms    
#### get  
  
```shell  
$ hkubectl algorithm get < name >  
```  
Gets an algorithm by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
#### delete  
  
```shell  
$ hkubectl algorithm delete < name >  
```  
Deletes an algorithm by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
#### version  
  
```shell  
$ hkubectl algorithm version < name >  
```  
Gets versions of algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
|--setCurrent, --set|Sets the current version|string|||  
|--force|If true forces the change of the version (might stop running pipelines)|boolean|||  
#### template  
  
```shell  
$ hkubectl algorithm template [ name ]  
```  
Create algorithm template for builds    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|--codePath|the code path for the algorithm  [required]|string|true||  
|--codeEntryPoint, --entryPoint|the code entry point for the algorithm  |string||main|  
|--env|the algorithm env  [required] [choices: "python", "nodejs"]|string|true||  
|--overwrite|overwrite an existing folder|boolean|||  
|--cpu|CPU requirements of the algorithm in cores  |number||0.1|  
|--gpu|GPU requirements of the algorithm in cores  |number||0|  
|--mem|memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi  |string||512Mi|  
### pipeline  
---  
```shell  
$ hkubectl pipeline < command >  
```  
Manage loaded algorithms    
#### get  
  
```shell  
$ hkubectl pipeline get [ name ]  
```  
Gets an pipeline by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
#### store  
  
```shell  
$ hkubectl pipeline store   
```  
Store pipeline    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-f, --file|path for descriptor file|string|true||  
|--readmeFile|path for readme file. example: --readmeFile="./readme.md|string|||  
### sync  
---  
```shell  
$ hkubectl sync < command >  
```  
sync local source folder into algorithm container in the cluster    
#### watch  
  
```shell  
$ hkubectl sync watch   
```  
watch a local folder, navigate menu to apply sync changes at will    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-a, --algorithmName|The name of the algorithm to sync data into  [required]|string|true||  
|-f, --folder|local folder to sync.|string||./|  
|--bidirectional, --bidi|Sync files in both ways |boolean||false|  
#### create  
  
```shell  
$ hkubectl sync create   
```  
creates the algorithm for development.    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-a, --algorithmName|The name of the algorithm|string|true||  
|-f, --folder|local folder to build from.  |string||./|  
|--env|algorithm runtime environment  [choices: "python", "nodejs"]|string|||  
|-e, --entryPoint|the main file of the algorithm|string|||  
|--baseImage|base image for the algorithm|string|||  
#### start  
  
```shell  
$ hkubectl sync start   
```  
Engage development mode for an algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-a, --algorithmName|The name of the algorithm to sync files into  [required]|string|true||  
|-f, --devFolder|folder in pod to sync to|string|true||  
#### stop  
  
```shell  
$ hkubectl sync stop   
```  
Disengage development mode for an algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|-a, --algorithmName|The name of the algorithm to stop syncing files into|string|true||  
### config  
---  
```shell  
$ hkubectl config [ command ]  
```  
Set configuration options for hkubectl    
#### set  
  
```shell  
$ hkubectl config set   
```  
Sets configuration options.    
#### get  
  
```shell  
$ hkubectl config get   
```  
Gets the current configuration.    
### datasource  
---  
```shell  
$ hkubectl datasource < command >  
```  
Execution pipelines as raw or stored    
#### sync  
  
```shell  
$ hkubectl datasource sync   
```  
should be called after push updates to git, creates a new version entry on the
datasource service    
#### prepare  
  
```shell  
$ hkubectl datasource prepare   
```  
should be called before commiting to git, scans the directory and updates all
the.dvc files    
#### push  
  
```shell  
$ hkubectl datasource push   
```  
calls dvc, git push and hkube datasource hkube datasource prepare and sync    
#### commit  
  
```shell  
$ hkubectl datasource commit   
```  
prepares dvc files, commit changes to git and pushes  