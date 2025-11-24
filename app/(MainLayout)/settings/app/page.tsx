"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, User, Download } from "lucide-react";
import InstallButton from "@/components/InstallButton"; // import your install button

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const Settings: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and account configurations.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Show profile publicly</span>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Enable activity logs</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Two-Factor Authentication</span>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Hide Online Status</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Download / Install Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <CardTitle>Install / Download App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Install this app to get an app-like experience and access offline.
            </p>
            <InstallButton />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
