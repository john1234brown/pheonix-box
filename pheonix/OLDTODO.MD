# Requirements
- Simple Easy to use Executable that runs off configuration file!
- Simple Easy to use Command line for adding and removing file path or folder path to configurations!
- Easy to configure fileType allow list!
- Simple to use Command line for adding and removing fileTypes allowed!

- command line usage for adding and removing configs should use this style
```cmd ./binary config add/remove```

- Easy to configure interval rate with a set minimum required for 1 second intervals!
- Easy to configure thread usage!
- Should run multiple thread intervals for looping through and checking the files and folders for specific file types and store there hashes in private array in runetime!
- Should also during checking of the files and folder it should store in another private array the content of each one in a map style using path string for key!!
- later on each interval double check these and replace any files that dont match back with there original content!

- Command Line execution to start up! this process
```cmd ./binary start```


# Description
Simple to use Executable that can hold set collection of files hashes in runtime and there contents and check during runtime there hashes upon mismatch replace there contents with one stored in runtime!