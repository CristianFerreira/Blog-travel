import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticateDataService } from '../../services/authenticate-data.service';
import { PostDataService } from '../../services/post-data.service';
import { Author } from '../../models/api/author';
import { Post } from '../../models/api/post';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  providers: [AuthenticateDataService, PostDataService]
})
export class PostComponent {

  public form: FormGroup;
  public author: Author;
  public post: Post;
  public tags: Array<string>;

  public btnConfiguracao: boolean;

  public open: boolean;
  public fixed: boolean;
  public top: string;
  public animationMode: string;

  constructor(private fb: FormBuilder, private authenticateService: AuthenticateDataService, private postService: PostDataService,
    private route: ActivatedRoute, private router: Router) {

    //btn settings
    this.fixed = false;
    this.open = false;
    this.top = 'up';
    this.animationMode = 'scale';

    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])],
      description: ['', Validators.compose([
        Validators.minLength(4),
        Validators.required
      ])],
      category: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(40),
        Validators.required
      ])],
      continent: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(40),
      ])],
      country: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(40),
      ])],
      state: ['', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(40),
      ])],
      city: ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(40),
      ])],
      tags: [''],
      active: [''],
      btnConfiguracao: ['']
    });
    this.post = new Post();
    this.tags = new Array<string>();
    this.author = this.authenticateService.contextoLogado();
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id != null)
        this.getPostById(id);
      else
        this.post.active = true;
    });

    this.getAllTags();
  }

  getPostById(id: number) {
    this.postService.getById(id)
      .subscribe(result => {
        this.post = <Post>result.json().data;
      }, error => {

      });
  }

  getAllTags() {
    this.postService.getAllTags()
      .subscribe(result => {
        let data = <any>result.json().data.map((t) => {return t.tags});
        data.forEach(tags => {
            tags.forEach(tag => {
                if(this.tags.indexOf(tag) == -1)
                  this.tags.push(tag);
            });
        });
        console.log(this.tags);
      }, error => {

      });
  }

  submit() {
    if (this.post.tags.length > 0) {
      this.post.tags = this.post.tags.map((tag) => {
        let tagPost = <any>tag;
        return tagPost.value ? tagPost.value : tagPost;
      })
    }

    if (!this.post._id)
      this.create();
    else
      this.update();
  }

  create() {
    this.post.author = this.author.id;
    this.postService.create(this.post)
      .subscribe(result => {
        this.router.navigateByUrl('/');
      });
  }

  update() {
    this.post.author = this.author.id;
    this.postService.update(this.post)
      .subscribe(result => {
        this.router.navigateByUrl('/');
      });
  }

  removeClassVideo() {
    $('.fr-video').removeClass('fr-video');
  }


  copyImg() {
    this.copyTxt('style="max-height: 100%;max-width: 100%;width: auto; ' +
      ' height: auto;box-shadow: 0 29px 32px -30px rgba(0,0,0,0.5);margin: ' +
      ' 2vh auto 20px;border-radius: 8px;"');
  }

  copyPaddingTxt() {
    this.copyTxt('<div style="padding: 0px 15px 0px 15px;">');
  }

  copyVideo() {
    this.copyTxt('class="video-post" ');
  }

  copyTxt(txt: string) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(txt).select();
    document.execCommand("copy");
    $temp.remove();
  }


}
