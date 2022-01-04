import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import{SharedDataServiceService} from '../../Core/Providers/SharedService/shared-data-service.service'
import {
  validateUserDetails,
} from '../../Core/Providers/graphQL/graph-ql.service';
import { ApiServiceService } from 'src/app/Core/Providers/api-service/api-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  form: FormGroup;
  submitted = false;
  check: string;
  loading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private sharedDataService: SharedDataServiceService,
    private service: ApiServiceService,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  loginVT() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
  }
  this.loading = true;

    this.apollo
    .use('live')
      .watchQuery({
        query: validateUserDetails,
        variables: {
          username: this.f.username.value,
          password: this.f.password.value,
        },
      })
      .valueChanges.subscribe(({ data }) => {
        if (data['validateUsers'] != null) {
          if (data['validateUsers']['success'] == true)
          {
            this.service.setUserId({
              userId:data['validateUsers']['userID']
            });
            this.router.navigate(['/dashboard']);
            this.form.reset();
          }

          else
          {
            alert(`Invalid credentials. Please try again.`);
            this.form.reset();
          }

        } else
        {
          alert(`Invalid credentials. Please try again.`);
          this.form.reset();
        }
      });


    // this.router.navigate(['/dashboard']);
  }
}
