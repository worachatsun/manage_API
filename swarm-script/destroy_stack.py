import csv
import subprocess
import os
import shutil
import time
import sys
from subprocess import Popen,PIPE
from datetime import datetime 

in_js = sys.stdin.readlines()

class SwarmLogger:
    def logs(self,message):
        datenow = datetime.today().strftime('%d-%m-%Y %H:%M:%S')
        with open('/var/www/manage_API/swarm-script/alumni-swarm.log','a+') as logf:
            logf.write(datenow+' || '+message+'\n')

class alumniSwarm:
    swarmLogger = SwarmLogger()
    def remove_stack(self,institute):
        command = ["docker","rm","-f",institute+"_web_1"]
        self.run_command(command)
        command = ["docker","rm","-f",institute+"_db_1"]
        self.run_command(command)
        command = ["docker","rm","-f",institute+"_api_1"]
        self.run_command(command)
        self.swarmLogger.logs(" - Removed "+institute+" stack.")

    def run_command(self, command):
        debugcommand = " - {0}".format(" ".join(command))
        popen = subprocess.Popen(command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        popen.wait() # wait a little for docker to complete
        print(popen.communicate())
        return popen

alumniSwarm().remove_stack(in_js[0].rstrip())