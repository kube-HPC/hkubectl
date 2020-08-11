# hkubectl

## Install

```bash
curl -Lo hkubectl https://github.com/kube-HPC/hkubectl/releases/download/$(curl -s https://api.github.com/repos/kube-HPC/hkubectl/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/hkubectl-linux \
&& chmod +x hkubectl \
&& sudo mv hkubectl /usr/local/bin/
```

## Usage

```sh
$ hkubectl --help
```

Help output:

```
hkubectl [command]

Commands:
  hkubectl exec <command>       Execution pipelines as raw or stored
  hkubectl algorithm <command>  Manage loaded algorithms
  hkubectl pipeline <command>   Manage loaded algorithms
  hkubectl dry-run <command>    run pipeline locolly for debugging
  hkubectl sync <command>       sync local source folder into algorithm
                                container in the cluster
  hkubectl config [command]     Set configuration options for hkubectl
  hkubectl completion           generate completion script

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]

for more information visit http://hkube.io
```

## Available commands

* [exec](#exec)
* [algorithm](#algorithm)
* [pipeline](#pipeline)
* [dry-run](#dry-run)
* [sync](#sync)
* [config](#config)

### exec

```sh
$ hkubectl exec --help
```

Help output:

```
hkubectl exec <command>

Execution pipelines as raw or stored

Commands:
  hkubectl exec get <jobId>            Returns the executed pipeline data
  hkubectl exec raw                    execute raw pipeline from file
  hkubectl exec stored [name]          execute pipeline by name
  hkubectl exec stop <jobId> [reason]  call to stop pipeline execution
  hkubectl exec status <jobId>         Returns a status for the current pipeline
  hkubectl exec result <jobId>         returns result for the execution of a
                                       specific pipeline run
  hkubectl exec algorithm [name]       execute algorithm

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate
                                                     [boolean] [default: "true"]
  --endpoint, -e        url of hkube api endpoint
                        [string] [default: "http://127.0.0.1/hkube/api-server/"]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```

### algorithm

```sh
$ hkubectl algorithm --help
```

Help output:

```
hkubectl algorithm <command>

Manage loaded algorithms

Commands:
  hkubectl algorithm apply [name]   apply an algorithm
  hkubectl algorithm list           Lists all registered algorithms
  hkubectl algorithm get <name>     Gets an algorithm by name
  hkubectl algorithm delete <name>  Deletes an algorithm by name

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```

### pipeline

```sh
$ hkubectl pipeline --help
```

Help output:

```
hkubectl pipeline <command>

Manage loaded algorithms

Commands:
  hkubectl pipeline get [name]  Gets an pipeline by name
  hkubectl pipeline store       Store pipeline

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate
                                                     [boolean] [default: "true"]
  --endpoint            url of hkube api endpoint
                        [string] [default: "http://127.0.0.1/hkube/api-server/"]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```

### dry-run

```sh
$ hkubectl dry-run --help
```

Help output:

```
hkubectl dry-run <command>

run pipeline locolly for debugging

Commands:
  hkubectl dry-run start  start dry run

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```

### sync

```sh
$ hkubectl sync --help
```

Help output:

```
hkubectl sync <command>

sync local source folder into algorithm container in the cluster

Commands:
  hkubectl sync watch   watch a local folder
  hkubectl sync create  creates the algorithm for development.

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```

### 

```sh
$ hkubectl  --help
```

Help output:

```
hkubectl [command]

Commands:
  hkubectl exec <command>       Execution pipelines as raw or stored
  hkubectl algorithm <command>  Manage loaded algorithms
  hkubectl pipeline <command>   Manage loaded algorithms
  hkubectl dry-run <command>    run pipeline locolly for debugging
  hkubectl sync <command>       sync local source folder into algorithm
                                container in the cluster
  hkubectl config [command]     Set configuration options for hkubectl
  hkubectl completion           generate completion script

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]

for more information visit http://hkube.io
```

### config

```sh
$ hkubectl config --help
```

Help output:

```
hkubectl config [command]

Set configuration options for hkubectl

Commands:
  hkubectl config set [key] [value]  Sets configuration options.
  hkubectl config get                Gets the current configuration.

Options:
  --version             Show version number                            [boolean]
  --rejectUnauthorized  set to false to ignore certificate signing errors.
                        Useful for self signed TLS certificate         [boolean]
  --endpoint            url of hkube api endpoint                       [string]
  --verbose             verbose logging                                [boolean]
  --json, -j            output json to stdout                          [boolean]
  --help                Show help                                      [boolean]
```


## License

MIT.