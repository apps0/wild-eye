import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  ThemeService,
  AlertService,
  SettingsService,
} from 'src/app/shared';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    public auth: AuthService,
    public router: Router,
    private fb: FormBuilder,
    private themeService: ThemeService,
    private settingsServices: SettingsService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.settingsServices.get().subscribe((x) => {
      console.log('alertService.get', x);
      this.patchForm(x);
    });
  }

  async onSubmit() {
    if (this.createForm.valid) {
      await this.themeService.progress(true);
      const data = this.createForm.value;
      await this.settingsServices.save(data);
      await this.themeService.progress(false);
    } else {
      await this.themeService.toast('All fields are required.');
    }
  }

  initForm() {
    this.createForm = this.fb.group({
      tags: ['', Validators.required],
      sound: [false],
      snooze: [10, Validators.required],
    });
  }

  patchForm(data) {
    if (!data) return;

    this.createForm.patchValue({
      tags: data.tags,
      sound: data.sound,
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    this.auth.signOut();
  }
}
